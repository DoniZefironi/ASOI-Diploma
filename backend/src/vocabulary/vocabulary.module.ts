import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VocabTerm } from './entities/vocab-term.entity';
import { VocabularyService } from './vocabulary.service';
import { VocabularyController } from './vocabulary.controller';
import { VocabularySeeder } from './vocabulary.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([VocabTerm])],
  controllers: [VocabularyController],
  providers: [VocabularyService, VocabularySeeder],
  exports: [VocabularyService],
})
export class VocabularyModule {}
