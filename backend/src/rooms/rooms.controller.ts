import {
  Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe,
  UseGuards, Request,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto, UpdateRoomDto, UpdateMemberRoleDto } from './dto/room.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('rooms')
@UseGuards(JwtAuthGuard)
export class RoomsController {
  constructor(private readonly svc: RoomsService) {}

  @Post()
  create(@Body() dto: CreateRoomDto, @Request() req: any) {
    return this.svc.create(dto, req.user.userId);
  }

  @Get()
  findMine(@Request() req: any) {
    return this.svc.findMyRooms(req.user.userId);
  }

  @Get('public')
  findPublic() {
    return this.svc.findPublicRooms();
  }

  @Get('invite/:code')
  findByCode(@Param('code') code: string) {
    return this.svc.findByInviteCode(code);
  }

  @Post('invite/:code/join')
  join(@Param('code') code: string, @Request() req: any) {
    return this.svc.joinByInvite(code, req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.svc.findOne(id, req.user.userId);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRoomDto, @Request() req: any) {
    return this.svc.update(id, dto, req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.svc.remove(id, req.user.userId);
  }

  @Post(':id/invite/regenerate')
  regenerateInvite(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.svc.regenerateInvite(id, req.user.userId);
  }

  @Delete(':id/members/:userId')
  removeMember(
    @Param('id', ParseIntPipe) id: number,
    @Param('userId', ParseIntPipe) memberId: number,
    @Request() req: any,
  ) {
    return this.svc.removeMember(id, memberId, req.user.userId);
  }

  @Patch(':id/members/:userId/role')
  updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Param('userId', ParseIntPipe) memberId: number,
    @Body() dto: UpdateMemberRoleDto,
    @Request() req: any,
  ) {
    return this.svc.updateMemberRole(id, memberId, dto, req.user.userId);
  }

  @Post(':id/state')
  saveState(@Param('id', ParseIntPipe) id: number, @Body() body: any, @Request() req: any) {
    return this.svc.saveState(id, body.state, req.user.userId);
  }
}
