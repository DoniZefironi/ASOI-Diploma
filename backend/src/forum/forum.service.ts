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
  ) {}

  // Sections
  async createSection(createSectionDto: CreateForumSectionDto): Promise<ForumSection> {
    const section = this.sectionRepository.create(createSectionDto);
    return this.sectionRepository.save(section);
  }

  async findAllSections(): Promise<ForumSection[]> {
    return this.sectionRepository.find({
      relations: ['course', 'topics'],
      order: { createdAt: 'ASC' },
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
      order: { createdAt: 'ASC' },
    });
  }

  // Topics
  async createTopic(createTopicDto: CreateForumTopicDto, authorId: number): Promise<ForumTopic> {
    const section = await this.sectionRepository.findOne({
      where: { id: createTopicDto.sectionId },
      relations: ['course'],
    });

    if (!section) {
      throw new NotFoundException('Forum section not found');
    }

    // Проверка, что пользователь зарегистрирован на курс
    const registration = await this.registrationRepository.findOne({
      where: {
        userId: authorId,
        courseGroupId: section.courseId,
        status: RegistrationStatus.APPROVED,
      },
    });

    if (!registration) {
      throw new ForbiddenException('You are not registered for this course');
    }

    const topic = this.topicRepository.create({
      ...createTopicDto,
      authorId,
    });

    const savedTopic = await this.topicRepository.save(topic);

    // Обновляем счетчик тем в разделе
    await this.sectionRepository.increment({ id: section.id }, 'topicCount', 1);

    return savedTopic;
  }

  async findTopicById(id: number): Promise<ForumTopic> {
    const topic = await this.topicRepository.findOne({
      where: { id },
      relations: ['section', 'author', 'posts', 'posts.author'],
    });

    if (!topic) {
      throw new NotFoundException('Forum topic not found');
    }

    // Увеличиваем счетчик просмотров
    await this.topicRepository.increment({ id }, 'viewCount', 1);

    return topic;
  }

  async getTopicsBySection(sectionId: number): Promise<ForumTopic[]> {
    return this.topicRepository.find({
      where: { sectionId },
      relations: ['author', 'section'],
      order: { 
        isPinned: 'DESC',
        lastPostAt: 'DESC' 
      },
    });
  }

  // Posts
  async createPost(createPostDto: CreateForumPostDto, authorId: number): Promise<ForumPost> {
    const topic = await this.topicRepository.findOne({
      where: { id: createPostDto.topicId },
      relations: ['section', 'section.course'],
    });

    if (!topic) {
      throw new NotFoundException('Forum topic not found');
    }

    if (topic.isLocked) {
      throw new ForbiddenException('This topic is locked');
    }

    // Проверка, что пользователь зарегистрирован на курс
    const registration = await this.registrationRepository.findOne({
      where: {
        userId: authorId,
        courseGroupId: topic.section.courseId,
        status: RegistrationStatus.APPROVED,
      },
    });

    if (!registration) {
      throw new ForbiddenException('You are not registered for this course');
    }

    const post = this.postRepository.create({
      ...createPostDto,
      authorId,
    });

    const savedPost = await this.postRepository.save(post);

    // Обновляем счетчики
    await this.topicRepository.increment({ id: topic.id }, 'postCount', 1);
    await this.sectionRepository.increment({ id: topic.sectionId }, 'postCount', 1);

    // Обновляем время последнего сообщения в теме
    await this.topicRepository.update(topic.id, {
      lastPostAt: new Date(),
      lastPostById: authorId,
    });

    return savedPost;
  }

  async getPostsByTopic(topicId: number): Promise<ForumPost[]> {
    return this.postRepository.find({
      where: { topicId },
      relations: ['author'],
      order: { createdAt: 'ASC' },
    });
  }

  async getRecentTopics(limit: number = 10): Promise<ForumTopic[]> {
    return this.topicRepository.find({
      relations: ['section', 'author'],
      order: { lastPostAt: 'DESC' },
      take: limit,
    });
  }

  async pinTopic(topicId: number): Promise<ForumTopic> {
    const topic = await this.findTopicById(topicId);
    topic.isPinned = true;
    return this.topicRepository.save(topic);
  }

  async unpinTopic(topicId: number): Promise<ForumTopic> {
    const topic = await this.findTopicById(topicId);
    topic.isPinned = false;
    return this.topicRepository.save(topic);
  }

  async lockTopic(topicId: number): Promise<ForumTopic> {
    const topic = await this.findTopicById(topicId);
    topic.isLocked = true;
    return this.topicRepository.save(topic);
  }

  async unlockTopic(topicId: number): Promise<ForumTopic> {
    const topic = await this.findTopicById(topicId);
    topic.isLocked = false;
    return this.topicRepository.save(topic);
  }
}