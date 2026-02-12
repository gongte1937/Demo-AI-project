import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class IdeaOwnerGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const ideaId = request.params.id;
    const userId = request.user?.id;

    const idea = await this.prisma.idea.findUnique({ where: { id: ideaId } });

    if (!idea) {
      throw new NotFoundException('Idea not found');
    }

    if (idea.userId !== userId) {
      throw new ForbiddenException('You do not have access to this resource');
    }

    return true;
  }
}
