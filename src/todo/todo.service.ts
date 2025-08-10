import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly repo: Repository<Todo>,
  ) {}

  async create(createDto: CreateTodoDto): Promise<Todo> {
    const todo = this.repo.create(createDto);
    return this.repo.save(todo);
  }

  findAll(): Promise<Todo[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<Todo> {
    const todo = await this.repo.findOne({ where: { id } });
    if (!todo) throw new NotFoundException(`Todo with id ${id} not found`);
    return todo;
  }

  async update(id: number, updateDto: UpdateTodoDto): Promise<Todo> {
    const todo = await this.findOne(id);
    Object.assign(todo, updateDto);
    return this.repo.save(todo);
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    const res = await this.repo.delete(id);
    return { deleted: (res.affected ?? 0) > 0 };
  }
}
