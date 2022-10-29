import { ForbiddenException, Injectable } from '@nestjs/common';
import { Bookmark } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
  constructor(private databaseService: DatabaseService) {}

  async getBookmarks(userId: number): Promise<Bookmark[]> {
    return this.databaseService.bookmark.findMany({
      where: {
        userId,
      },
    });
  }

  async getBookmarkById(userId: number, bookmarkId: number): Promise<Bookmark> {
    return this.databaseService.bookmark.findFirst({
      where: {
        id: bookmarkId,
        userId,
      },
    });
  }

  async createBookmark(
    userId: number,
    dto: CreateBookmarkDto,
  ): Promise<Bookmark> {
    const bookmark = await this.databaseService.bookmark.create({
      data: {
        userId,
        ...dto,
      },
    });
    return bookmark;
  }

  async editBookmarkById(
    userId: number,
    bookmarkId: number,
    dto: EditBookmarkDto,
  ) {
    const bookmark = await this.databaseService.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    // Guard condition.
    if (!bookmark || bookmark.userId !== userId) {
      throw new ForbiddenException('Access to resource denied');
    }

    return this.databaseService.bookmark.update({
      where: {
        id: bookmarkId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteBookmarkById(userId: number, bookmarkId: number): Promise<null> {
    const bookmark = await this.databaseService.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    // Guard condition.
    if (!bookmark || bookmark.userId !== userId) {
      throw new ForbiddenException('Access to resource denied');
    }

    await this.databaseService.bookmark.delete({
      where: {
        id: bookmarkId,
      },
    });

    return null;
  }
}
