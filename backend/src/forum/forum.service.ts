// src/forum/forum.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ForumSection } from './entities/forum-section.entity';
import { ForumTopic } from './entities/forum-topic.entity';
import { ForumPost } from './entities/forum-post.entity';
import { CreateForumSectionDto } from './dto/create-forum-section.dto';
import { CreateForumTopicDto } from './dto/create-forum-topic.dto';
import { CreateForumPostDto } from './dto/create-forum-post.dto';
import { CourseRegistration, RegistrationStatus } from '../course-groups/entities/course-registration.entity';
import { AchievementsService } from '../achievements/achievements.service';

@Injectable()
export class ForumService {
  constructor(
    @InjectRepository(ForumSection)
    private sectionRepository: Repository<ForumSection>,
    @InjectRepository(ForumTopic)
    private topicRepository: Repository<ForumTopic>,
    @InjectRepository(ForumPost)
    private postRepository: Repository<ForumPost>,
    @InjectRepository(CourseRegistration)
    private registrationRepository: Repository<CourseRegistration>,
    private readonly achievementsService: AchievementsService,
  ) {}

  async createSection(createSectionDto: CreateForumSectionDto): Promise<ForumSection> {
    const section = this.sectionRepository.create(createSectionDto);
    return this.sectionRepository.save(section);
  }

  async findAllSections(): Promise<ForumSection[]> {
    return this.sectionRepository.find({
      relations: ['course', 'topics'],
      order: { orderIndex: 'ASC', createdAt: 'ASC' },
    });
  }

  async findSectionById(id: number): Promise<ForumSection> {
    const section = await this.sectionRepository.findOne({
      where: { id },
      relations: ['course', 'topics', 'topics.author'],
    });

    if (!section) {
      throw new NotFoundException('Forum section not found');
    }

    return section;
  }

  async getSectionsByCourse(courseId: number): Promise<ForumSection[]> {
    return this.sectionRepository.find({
      where: { courseId },
      relations: ['course', 'topics'],
      order: { orderIndex: 'ASC', createdAt: 'ASC' },
    });
  }

  async createTopic(createTopicDto: CreateForumTopicDto, authorId: number): Promise<ForumTopic> {
    const section = await this.sectionRepository.findOne({
      where: { id: createTopicDto.sectionId },
      relations: ['course'],
    });

    if (!section) {
      throw new NotFoundException('Forum section not found');
    }

    const topic = this.topicRepository.create({
      ...createTopicDto,
      authorId,
    });

    return await this.topicRepository.save(topic);
  }

  async findTopicById(id: number): Promise<ForumTopic> {
    const topic = await this.topicRepository.findOne({
      where: { id },
      relations: ['section', 'author', 'posts', 'posts.author'],
    });

    if (!topic) {
      throw new NotFoundException('Forum topic not found');
    }

    // Сортируем посты по дате создания
    if (topic.posts) {
      topic.posts.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    }

    await this.topicRepository.increment({ id }, 'viewsCount', 1);

    return topic;
  }

  async getTopicsBySection(sectionId: number): Promise<ForumTopic[]> {
    return this.topicRepository.find({
      where: { sectionId },
      relations: ['author', 'section'],
      order: {
        isPinned: 'DESC',
        createdAt: 'DESC',
      },
    });
  }

  async createPost(createPostDto: CreateForumPostDto, authorId: number): Promise<ForumPost> {
    const topic = await this.topicRepository.findOne({
      where: { id: createPostDto.topicId },
      relations: ['section'],
    });

    if (!topic) {
      throw new NotFoundException('Forum topic not found');
    }

    if (topic.isClosed) {
      throw new ForbiddenException('This topic is closed');
    }

    const post = this.postRepository.create({
      ...createPostDto,
      authorId,
    });

    const savedPost = await this.postRepository.save(post);

    await this.topicRepository.update(topic.id, { lastPostAt: new Date() });

    this.achievementsService.checkAndGrantAchievements(authorId).catch(() => {});

    return savedPost;
  }

  async getPostsByTopic(topicId: number): Promise<ForumPost[]> {
    return this.postRepository.find({
      where: { topicId },
      relations: ['author'],
      order: { createdAt: 'ASC' },
    });
  }

  async updatePost(postId: number, content: string, authorId: number): Promise<ForumPost> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['topic'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.authorId !== authorId) {
      throw new ForbiddenException('You can only edit your own posts');
    }

    post.content = content;
    post.isEdited = true;
    post.updatedAt = new Date();

    return this.postRepository.save(post);
  }

  async deletePost(postId: number, authorId: number, isAdmin: boolean): Promise<void> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.authorId !== authorId && !isAdmin) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    await this.postRepository.remove(post);
  }

  async toggleTopicPinned(topicId: number): Promise<ForumTopic> {
    const topic = await this.topicRepository.findOne({ where: { id: topicId } });
    if (!topic) {
      throw new NotFoundException('Topic not found');
    }
    topic.isPinned = !topic.isPinned;
    return this.topicRepository.save(topic);
  }

  async toggleTopicClosed(topicId: number): Promise<ForumTopic> {
    const topic = await this.topicRepository.findOne({ where: { id: topicId } });
    if (!topic) {
      throw new NotFoundException('Topic not found');
    }
    topic.isClosed = !topic.isClosed;
    return this.topicRepository.save(topic);
  }

  async deleteTopic(topicId: number): Promise<void> {
    const topic = await this.topicRepository.findOne({ where: { id: topicId } });
    if (!topic) {
      throw new NotFoundException('Topic not found');
    }
    await this.topicRepository.remove(topic);
  }

  async updateTopic(topicId: number, updates: { title?: string; content?: string }, authorId: number): Promise<ForumTopic> {
    const topic = await this.topicRepository.findOne({ where: { id: topicId } });
    if (!topic) {
      throw new NotFoundException('Topic not found');
    }
    if (topic.authorId !== authorId) {
      throw new ForbiddenException('You can only edit your own topics');
    }
    Object.assign(topic, updates);
    return this.topicRepository.save(topic);
  }

  async deleteSection(sectionId: number): Promise<void> {
    const section = await this.sectionRepository.findOne({ where: { id: sectionId } });
    if (!section) {
      throw new NotFoundException('Section not found');
    }
    await this.sectionRepository.remove(section);
  }

  async updateSection(sectionId: number, updates: Partial<CreateForumSectionDto>): Promise<ForumSection> {
    await this.sectionRepository.update(sectionId, updates);
    const section = await this.sectionRepository.findOne({ where: { id: sectionId } });
    if (!section) {
      throw new NotFoundException('Section not found');
    }
    return section;
  }
}
