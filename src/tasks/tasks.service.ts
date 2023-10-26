import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks.filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getTaskById(id: string): Task {
    //try to get task

    // if not found, throw an error (404 not found)

    // otherwise, return the found task
    const found = this.tasks.find((task: Task) => task.id === id);

    if (!found) {
      throw new NotFoundException(`Task with ID ${id} not found.`);
    }

    return found;
  }
  getAllTasks(): Task[] {
    return this.tasks;
  }
  getTasksWilFilters(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;
    let tasks = this.getAllTasks();
    if (status) {
      tasks = tasks.filter((task: Task) => task.status === status);
    }
    if (search) {
      tasks = tasks.filter((task: Task) => {
        if (
          task.title.toLowerCase().includes(search) ||
          task.description.toLowerCase().includes(search)
        ) {
          return true;
        }
        return false;
      });
    }
    return tasks;
  }
  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);

    return task;
  }
  deleteTask(id: string): void {
    const found = this.getTaskById(id);
    this.tasks = this.tasks.filter((task: Task) => task.id !== found.id);
  }

  updateTaskStatus(id: string, updateTaskStatusDto: UpdateTaskStatusDto): Task {
    const task = this.getTaskById(id);
    task.status = updateTaskStatusDto.status;
    return task;
  }
}
