import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hackathon } from './entities/hackathon.entity';
import { HackathonTeam } from './entities/hackathon-team.entity';
import { HackathonTeamMember } from './entities/hackathon-team-member.entity';
import { HackathonSubmission } from './entities/hackathon-submission.entity';
import { HackathonGrade } from './entities/hackathon-grade.entity';
import { HackathonStage } from './entities/hackathon-stage.entity';
import { HackathonTask } from './entities/hackathon-task.entity';
import { HackathonsService } from './hackathons.service';
import { HackathonsController } from './hackathons.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Hackathon,
      HackathonTeam,
      HackathonTeamMember,
      HackathonSubmission,
      HackathonGrade,
      HackathonStage,
      HackathonTask,
    ])
  ],
  providers: [HackathonsService],
  controllers: [HackathonsController],
  exports: [HackathonsService],
})
export class HackathonsModule {}
