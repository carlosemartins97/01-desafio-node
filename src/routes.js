import { Database } from "../database.js";
import { randomUUID } from "node:crypto";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database();

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const tasks = database.select("tasks");

      return res.end(JSON.stringify(tasks));
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body;

      if (title && description) {
        const task = {
          id: randomUUID(),
          title,
          description,
          completed_at: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        database.insert("tasks", task);

        return res.writeHead(201).end(JSON.stringify(task));
      }

      return res.writeHead(400).end();
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      const task = database.select("tasks", { id });
      const hasTask = task.length === 0;

      if (hasTask) {
        return res
          .writeHead(404)
          .end(JSON.stringify({ message: "Registro não existe" }));
      }

      database.delete("tasks", id);

      return res.writeHead(201).end("deleted");
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;

      const [task] = database.select("tasks", { id });

      if (task.length === 0) {
        return res
          .writeHead(404)
          .end(JSON.stringify({ message: "Registro não existe" }));
      }

      if (!title || !description) {
        return res.writeHead(400).end();
      }

      const updatedTask = {
        ...task,
        title,
        description,
        updated_at: new Date().toISOString(),
      };

      database.update("tasks", id, updatedTask);

      return res.writeHead(201).end("updated");
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: (req, res) => {
      const { id } = req.params;

      const task = database.selectById("tasks", id);

      if (!task || task?.length === 0) {
        return res
          .writeHead(404)
          .end(JSON.stringify({ message: "Registro não existe" }));
      }

      const updatedTask = {
        ...task,
        completed_at: new Date().toISOString(),
      };

      database.update("tasks", id, updatedTask);

      return res.writeHead(201).end(JSON.stringify(updatedTask));
    },
  },
];
