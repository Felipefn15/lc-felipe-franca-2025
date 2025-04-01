"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { getAuthors, newPost } from "./actions";
import { useEffect, useState } from "react";
import { generatePostDraft } from "@/lib/openai";

interface Author {
  id: number;
  name: string | null;
}

export default function NewPost() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue
  } = useForm<{
    authorId: number;
    title: string;
    content?: string;
    keywords?: string;
  }>();

  const [authors, setAuthors] = useState<Author[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchAuthors = async () => {
      const authors = await getAuthors();
      setAuthors(authors);
    };
    fetchAuthors();
  }, []);

  const router = useRouter();

  const renderAuthors = () =>
    authors.map((author) => (
      <option value={author.id} key={author.id}>
        {author.name}
      </option>
    ));

  const generatePost = async () => {
    setIsLoading(true);
    const draft = await generatePostDraft(getValues("keywords") || '');
    setValue("content", draft || '') ;
    setIsLoading(false)
  };

  return (
    <>
      <h1 className="text-center font-bold text-lg my-4">New Post</h1>
      <form
        className="flex flex-col gap-4 max-w-lg mx-auto"
        onSubmit={handleSubmit(async (data) => {
          await newPost(data);
          router.push("/");
        })}
      >
        <div className="flex flex-col">
          <label className="font-bold" htmlFor="author">
            Author
          </label>
          <select
            className="p-2 border border-gray-400 rounded-sm"
            id="author"
            {...register("authorId")}
          >
            {renderAuthors()}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="font-bold" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            className="p-2 border border-gray-400 rounded-sm"
            placeholder="An eye-catching blog post"
            {...register("title", { required: true })}
          />
          {errors.title && (
            <p className="text-red-500 font-bold">Title is required.</p>
          )}
        </div>
        <div className="flex flex-col">
          <label className="font-bold" htmlFor="keywords">
            Content draft keywords
          </label>
          <div className="flex items-center gap-2">
            <input
              id="keywords"
              className="p-2 border border-gray-400 rounded-sm flex-1"
              placeholder="software development, AI, ChatGPT"
              {...register("keywords", { required: false })}
            />
            <button
              type="button"
              disabled={isLoading}
              onClick={() => generatePost()}
              className={`border border-orange-600 rounded-sm p-2 bg-orange-400 text-white font-bold ${isLoading && 'opacity-50'}`}
            >
              Generate
            </button>
          </div>
        </div>
        <div className="flex flex-col">
          <label className="font-bold" htmlFor="content">
            Content
          </label>
          <textarea
            id="content"
            className="p-2 border border-gray-400 rounded-sm"
            rows={3}
            {...register("content")}
          />
        </div>
        <button
          type="submit"
          className="border border-orange-600 rounded-sm p-2 bg-orange-400 text-white font-bold"
        >
          Submit
        </button>
      </form>
    </>
  );
}
