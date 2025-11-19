import { Hono } from "hono";

const app = new Hono();

type Task = {
  name: string;
  desc: string;
};

function GenerateId(): string {
  let id: string;
  do {
    id = Math.floor(10000 + Math.random() * 90000).toString();
  } while (DB.has(id));
  return id;
}

const DB = new Map<string, Task>();

// req data = { name: string, desc: string }
app.post("/task", async (c) => {
  try {
    const body = await c.req.json();
    const { name, desc } = body;

    if (!name || !desc) {
      return c.json({ message: "Invalid Data" }, 400);
    }

    const id = GenerateId();

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
    const tasks = Array.from(DB, ([id, task]) => ({
      id,
      name: task.name,
      desc: task.desc,
    }));

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
      data: { id, task },
    });
  } catch (error) {
    console.log(error);
    return c.json({ message: "Internal Server Error" }, 500);
  }
});

app.put("/task", async (c) => {
  try {
    const id = c.req.query("id");
    if (!id) {
      return c.json({ message: "Id Not Found" }, 400);
    }

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

app.delete("/task", async (c) => {
  try {
    const id = c.req.query("id");

    if (!id) {
      return c.json({ message: "Id Not Found" }, 400);
    }

    if (!DB.has(id)) {
      return c.json({ message: "Id Not Found" }, 400);
    }

    DB.delete(id);

    return c.json({
      message: "delete method Working successfully",
    });
  } catch (error) {
    console.log(error);
    return c.json({ message: "Internal Server Error" }, 500);
  }
});

export default app;
