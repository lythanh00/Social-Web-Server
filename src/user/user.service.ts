import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { EMPTY, from, Observable, of, throwError } from 'rxjs';
import { mergeMap, tap, throwIfEmpty, catchError, map } from 'rxjs/operators';
import { RoleType } from '../shared/enum/role-type.enum';
import { USER_MODEL } from '../database/database.constants';
import { User, UserModel } from '../database/user.model';
import { SendgridService } from '../sendgrid/sendgrid.service';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_MODEL) private userModel: UserModel,
    private sendgridService: SendgridService,
  ) {}

  findByUsername(username: string): Observable<User> {
    return from(this.userModel.findOne({ username }).exec());
  }

  existsByUsername(username: string): Observable<boolean> {
    return from(this.userModel.exists({ username }).exec()).pipe(
      map((exists) => exists != null),
    );
  }

  existsByEmail(email: string): Observable<boolean> {
    return from(this.userModel.exists({ email }).exec()).pipe(
      map((exists) => exists != null),
    );
  }

  findById(id: string, withPosts = false): Observable<User> {
    const userQuery = this.userModel.findOne({ _id: id });
    if (withPosts) {
      userQuery.populate('posts');
    }
    return from(userQuery.exec()).pipe(
      mergeMap((p) => (p ? of(p) : EMPTY)),
      throwIfEmpty(() => new NotFoundException(`user:${id} was not found`)),
    );
  }
}
