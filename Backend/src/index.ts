import { Hono } from "hono";

const app = new Hono();

type Task = {
  name: string;
  desc: string;
};

type TaskTodo = {
  id: string;
  name: string;
  desc: string;
};

const DB = new Map<string, Task>();

// req data = { name: string, desc: string }
app.post("/task", async (c) => {
  try {
    const body = await c.req.json();
    const { name, desc } = body;

    if (!name || !desc) return c.json({ message: "Invalid Data" }, 400);

    const id = Math.floor(Math.random() * 1000).toString();

    DB.set(id, { name, desc });

    return c.json({
      message: "post method created successfully",
      data: { id },
    });
  } catch (error) {
    console.log(error);
    return c.json({ message: "Internal Server Error" }, 500);
  }
});

app.get("/task", async (c) => {
  try {
    const tasks: TaskTodo[] = [];

    DB.forEach((value, key) => {
      tasks.push({
        id: key,
        name: value.name,
        desc: value.desc,
      });
    });
    return c.json({
      message: "get method Created successfully",
      data: tasks,
    });
  } catch (error) {
    console.log(error);
    return c.json({ message: "Internal Server Error" }, 500);
  }
});

app.get("/task/:id", async (c) => {
  try {
    const { id } = c.req.param();
    
    if (!DB.has(id)) {
      return c.json({ message: "Id Not Found" }, 400);
    }

    const task = DB.get(id);
    return c.json({
      message: "Get Method By Id working Successfully",
      data: { id, task}
    });
  } catch (error) {
    console.log(error);
    return c.json({ message: "Internal Server Error" }, 500);
  }
})

app.put("/task/:id", async (c) => {
  try {
    const { id } = c.req.param();

    if (!DB.has(id)) {
      return c.json({ message: "Id Not Found" }, 400);
    }

    const body = await c.req.json();
    const { name, desc } = body;

    if (!name || !desc) return c.json({ message: "Invalid Data" }, 400);

    DB.set(id, { name, desc });

    return c.json({
      message: "put method created successfully",
      data: { id, name, desc },
    });
  } catch (error) {
    console.log(error);
    return c.json({ message: "Internal Server Error" }, 500);
  }
});

app.delete("/task/:id", async (c) => {
  try {
    const { id } = c.req.param();

    if (!DB.has(id)) {
      return c.json({ message: "Id Not Found" }, 400);
    }

    DB.delete(id);
    return c.json({
      message: "delete method Working successfully"
    })
  } catch (error) {
    console.log(error);
    return c.json({ message: "Internal Server Error" }, 500);
  }
});

export default app;
