import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hackathon } from './entities/hackathon.entity';
import { HackathonTeam } from './entities/hackathon-team.entity';
import { HackathonTeamMember } from './entities/hackathon-team-member.entity';
import { HackathonProject } from './entities/hackathon-project.entity';
import { HackathonJury } from './entities/hackathon-jury.entity';
import { HackathonGrade } from './entities/hackathon-grade.entity';
import { HackathonsService } from './hackathons.service';
import { HackathonsController } from './hackathons.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Hackathon,
      HackathonTeam,
      HackathonTeamMember,
      HackathonProject,
      HackathonJury,
      HackathonGrade
    ])
  ],
  providers: [HackathonsService],
  controllers: [HackathonsController],
  exports: [HackathonsService],
})
export class HackathonsModule {}