import { createClient } from "next-sanity";

export const client = createClient({
    projectId: "cb00lfqt",
    dataset: "production",
    apiVersion: "2023-11-01",
    useCdn: false,
});