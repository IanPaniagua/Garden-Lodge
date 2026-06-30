import { getCollection, type CollectionEntry } from "astro:content";
import { createClient } from "@insforge/sdk";
import { backlog as localBacklog, type BacklogItem } from "./progress";

const baseUrl =
  import.meta.env.PUBLIC_INSFORGE_URL ??
  "https://e29jwqbi.eu-central.insforge.app";
const anonKey =
  import.meta.env.PUBLIC_INSFORGE_ANON_KEY ??
  "anon_fad59a3b1120cf873c0bf8cdc70d0c2c6aa7eab89ac73a8ea8494807e0d1c384";

const client = createClient({ baseUrl, anonKey });

export type EpicStatus =
  | "draft"
  | "planned"
  | "in_progress"
  | "ready_to_publish"
  | "published"
  | "archived";

export type EpicPhoto = {
  src: string;
  key?: string;
  alt: string;
  caption: string;
};

export type GardenEpic = {
  id: string;
  slug: string;
  title: string;
  sprint: string;
  status: EpicStatus;
  date: Date | null;
  cover: string | null;
  coverUrl: string | null;
  summary: string;
  body: string;
  goal: {
    problem: string;
    context: string;
    plannedSolution: string;
  };
  learn: {
    learnings: string[];
    research: string[];
    strategy: string;
    photos: EpicPhoto[];
  };
  apply: {
    text: string;
    photos: EpicPhoto[];
  };
  leaveBetter: {
    text: string;
    result: string;
    photos: EpicPhoto[];
  };
  next: string[];
  source: "insforge" | "local";
};

const toArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];

const toPhotos = (value: unknown): EpicPhoto[] =>
  Array.isArray(value)
    ? value
        .map((photo: any) => ({
          src: String(photo?.src ?? ""),
          key: photo?.key ? String(photo.key) : undefined,
          alt: String(photo?.alt ?? ""),
          caption: String(photo?.caption ?? ""),
        }))
        .filter((photo) => photo.src)
    : [];

const contentSlug = (id: string) => id.replace(/^\d+-/, "");

function localEntryToEpic(entry: CollectionEntry<"progress">): GardenEpic {
  return {
    id: entry.id,
    slug: contentSlug(entry.id),
    title: entry.data.title,
    sprint: entry.data.sprint,
    status: "published",
    date: entry.data.date,
    cover: entry.data.cover,
    coverUrl: null,
    summary: entry.data.summary,
    body: entry.body ?? "",
    goal: entry.data.goal,
    learn: entry.data.learn,
    apply: entry.data.apply,
    leaveBetter: entry.data.leaveBetter,
    next: entry.data.next,
    source: "local",
  };
}

function rowToEpic(row: any): GardenEpic {
  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title ?? ""),
    sprint: String(row.sprint ?? ""),
    status: String(row.status ?? "draft") as EpicStatus,
    date: row.start_date ? new Date(row.start_date) : null,
    cover: null,
    coverUrl: row.cover_url ? String(row.cover_url) : null,
    summary: String(row.summary ?? ""),
    body: "",
    goal: {
      problem: String(row.goal?.problem ?? ""),
      context: String(row.goal?.context ?? ""),
      plannedSolution: String(row.goal?.plannedSolution ?? ""),
    },
    learn: {
      learnings: toArray(row.learn?.learnings),
      research: toArray(row.learn?.research),
      strategy: String(row.learn?.strategy ?? ""),
      photos: toPhotos(row.learn?.photos),
    },
    apply: {
      text: String(row.apply?.text ?? ""),
      photos: toPhotos(row.apply?.photos),
    },
    leaveBetter: {
      text: String(row.leave_better?.text ?? ""),
      result: String(row.leave_better?.result ?? ""),
      photos: toPhotos(row.leave_better?.photos),
    },
    next: toArray(row.next),
    source: "insforge",
  };
}

function mergeWithLocal(remote: GardenEpic, local: GardenEpic | undefined): GardenEpic {
  if (!local) return remote;
  return {
    ...remote,
    cover: remote.coverUrl ? remote.cover : local.cover,
    body: remote.body || local.body,
    learn: {
      ...remote.learn,
      photos: remote.learn.photos.length > 0 ? remote.learn.photos : local.learn.photos,
    },
    apply: {
      ...remote.apply,
      photos: remote.apply.photos.length > 0 ? remote.apply.photos : local.apply.photos,
    },
    leaveBetter: {
      ...remote.leaveBetter,
      photos:
        remote.leaveBetter.photos.length > 0
          ? remote.leaveBetter.photos
          : local.leaveBetter.photos,
    },
  };
}

async function getLocalEpics() {
  const entries = await getCollection("progress");
  return entries
    .map(localEntryToEpic)
    .sort((a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0));
}

async function getInsforgeEpics(status?: EpicStatus | EpicStatus[]) {
  let query = client.database.from("epics").select("*");
  if (Array.isArray(status)) query = query.in("status", status);
  else if (status) query = query.eq("status", status);
  const { data, error } = await query.order("start_date", { ascending: false });
  if (error || !Array.isArray(data)) return null;
  const localEpics = await getLocalEpics();
  const localBySlug = new Map(localEpics.map((epic) => [epic.slug, epic]));
  const remoteEpics = data
    .map(rowToEpic)
    .map((epic) => mergeWithLocal(epic, localBySlug.get(epic.slug)));
  const remoteSlugs = new Set(remoteEpics.map((epic) => epic.slug));
  const localOnlyEpics = localEpics.filter((epic) => !remoteSlugs.has(epic.slug));
  return [...remoteEpics, ...localOnlyEpics].sort(
    (a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0),
  );
}

export async function getPublicEpics() {
  const remote = await getInsforgeEpics("published");
  if (remote?.length) return remote;
  return getLocalEpics();
}

export async function getSprintBoardEpics() {
  const remote = await getInsforgeEpics(["planned", "in_progress", "published"]);
  if (remote?.length) return remote;
  return getLocalEpics();
}

export async function getPublicBacklog(): Promise<BacklogItem[]> {
  const { data, error } = await client.database
    .from("backlog_items")
    .select("*")
    .neq("status", "archived")
    .order("created_at", { ascending: false });

  if (error || !Array.isArray(data) || data.length === 0) return localBacklog;

  return data.map((item: any) => ({
    id: String(item.slug ?? item.id),
    title: String(item.title ?? ""),
    status: String(item.status ?? "idea") as BacklogItem["status"],
    priority: String(item.priority ?? "medium") as BacklogItem["priority"],
    problem: String(item.problem ?? ""),
    goal: String(item.goal ?? ""),
    notes: String(item.notes ?? ""),
  }));
}
