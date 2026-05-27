import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { genreOptions } from "@/lib/constants";
import type { Book, BookDraft } from "@/types/book";

const currentYear = new Date().getFullYear();

const bookSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  author: z.string().min(2, "Author name required"),
  genre: z.string().min(1, "Please select a genre"),
  publicationYear: z.coerce
    .number()
    .min(1000, "Invalid year")
    .max(currentYear, "Year cannot be in the future"),
  description: z.string().max(500, "Description must stay under 500 characters"),
  coverColor: z.string().default("#6366F1"),
  coverImage: z.string().url("Cover image must be a valid URL").or(z.literal("")),
});

type BookFormValues = z.output<typeof bookSchema>;
type BookFormInput = z.input<typeof bookSchema>;

type BookFormProps = {
  defaultValues?: Partial<Book>;
  isLoading?: boolean;
  onSubmit: (data: BookDraft) => void | Promise<void>;
};

export function BookForm({
  defaultValues,
  isLoading = false,
  onSubmit,
}: BookFormProps) {
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<BookFormInput, undefined, BookFormValues>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      author: defaultValues?.author ?? "",
      genre: defaultValues?.genre ?? "",
      publicationYear: defaultValues?.publicationYear ?? currentYear,
      description: defaultValues?.description ?? "",
      coverColor: defaultValues?.coverColor ?? "#6366F1",
      coverImage: defaultValues?.coverImage ?? "",
    },
  });

  return (
    <form
      className="grid gap-5"
      onSubmit={handleSubmit((data: BookFormValues) => onSubmit(data))}
    >
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" placeholder="Atomic Habits" {...register("title")} />
          {errors.title ? (
            <p className="mt-2 text-sm text-rose-500">{errors.title.message}</p>
          ) : null}
        </div>

        <div>
          <Label htmlFor="author">Author</Label>
          <Input id="author" placeholder="James Clear" {...register("author")} />
          {errors.author ? (
            <p className="mt-2 text-sm text-rose-500">{errors.author.message}</p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div>
          <Label htmlFor="genre">Genre</Label>
          <Select id="genre" {...register("genre")}>
            <option value="">Select genre</option>
            {genreOptions.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </Select>
          {errors.genre ? (
            <p className="mt-2 text-sm text-rose-500">{errors.genre.message}</p>
          ) : null}
        </div>

        <div>
          <Label htmlFor="publicationYear">Publication year</Label>
          <Input
            id="publicationYear"
            type="number"
            placeholder="2024"
            {...register("publicationYear")}
          />
          {errors.publicationYear ? (
            <p className="mt-2 text-sm text-rose-500">
              {errors.publicationYear.message}
            </p>
          ) : null}
        </div>

        <div>
          <Label htmlFor="coverColor">Cover color</Label>
          <Input id="coverColor" type="color" className="h-11 p-2" {...register("coverColor")} />
          {errors.coverColor ? (
            <p className="mt-2 text-sm text-rose-500">{errors.coverColor.message}</p>
          ) : null}
        </div>
      </div>

      <div>
        <Label htmlFor="coverImage">Cover image URL</Label>
        <Input
          id="coverImage"
          placeholder="https://example.com/cover.jpg"
          {...register("coverImage")}
        />
        {errors.coverImage ? (
          <p className="mt-2 text-sm text-rose-500">{errors.coverImage.message}</p>
        ) : null}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Short summary of the book..."
          {...register("description")}
        />
        {errors.description ? (
          <p className="mt-2 text-sm text-rose-500">{errors.description.message}</p>
        ) : null}
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-emerald-400 dark:text-zinc-950 dark:hover:bg-emerald-300 shadow-sm"
        disabled={isLoading}
      >
        {isLoading ? <LoaderCircle className="size-4 animate-spin" /> : null}
        {defaultValues ? "Save changes" : "Create book"}
      </Button>
    </form>
  );
}
