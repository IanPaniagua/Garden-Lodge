import { getCollection, type CollectionEntry } from "astro:content";
import backlogJson from "../../data/backlog.json";

/** All progress entries, newest first. */
export async function getProgressEntries(): Promise<
  CollectionEntry<"progress">[]
> {
  const entries = await getCollection("progress");
  return entries.sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
}

export type BacklogItem = {
  id: string;
  title: string;
  status: "idea" | "next" | "in_progress" | "done";
  priority: "low" | "medium" | "high";
  problem: string;
  goal: string;
  notes: string;
};

export const backlog = backlogJson as BacklogItem[];

export const statusLabels: Record<CollectionEntry<"progress">["data"]["status"], string> = {
  planned: "Planned",
  in_progress: "In progress",
  completed: "Completed",
};
