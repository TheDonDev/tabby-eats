
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type DatabaseStatus = {
  categories: number;
  meals: number;
};

export default function DatabaseTestPage() {
  const [status, setStatus] = useState<DatabaseStatus | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function testConnection() {
      try {
        const supabase = createClient();

        const [categoriesResult, mealsResult] = await Promise.all([
          supabase
            .from("categories")
            .select("id", { count: "exact", head: true }),

          supabase
            .from("meals")
            .select("id", { count: "exact", head: true }),
        ]);

        if (categoriesResult.error) {
          throw categoriesResult.error;
        }

        if (mealsResult.error) {
          throw mealsResult.error;
        }

        setStatus({
          categories: categoriesResult.count ?? 0,
          meals: mealsResult.count ?? 0,
        });
      } catch (err: unknown) {
        console.error("Supabase database test:", err);

        const dbError = err as {
          message?: string;
          code?: string;
          details?: string;
          hint?: string;
        };

        setError(
          [
            `Message: ${dbError.message ?? "Unknown error"}`,
            `Code: ${dbError.code ?? "Not provided"}`,
            `Details: ${dbError.details ?? "Not provided"}`,
            `Hint: ${dbError.hint ?? "Not provided"}`,
          ].join("\n")
        );
      } finally {
        setLoading(false);
      }
    }

    testConnection();
  }, []);

  return (
    <main className="min-h-screen bg-[#fff8ed] p-8">
      <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-[#42291f]">
          Tabby Eats Database Test
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Checking your Supabase connection.
        </p>

        {loading && (
          <p className="mt-8 text-orange-600">
            Connecting to Supabase...
          </p>
        )}

        {status && (
          <div className="mt-8 space-y-4">
            <div className="rounded-xl bg-green-50 p-4 text-green-800">
              <strong>Database connected successfully!</strong>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-orange-50 p-4">
                <p className="text-sm text-gray-600">
                  Food categories
                </p>
                <p className="text-3xl font-bold">
                  {status.categories}
                </p>
              </div>

              <div className="rounded-xl bg-orange-50 p-4">
                <p className="text-sm text-gray-600">Meals</p>
                <p className="text-3xl font-bold">
                  {status.meals}
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-8 rounded-xl bg-red-50 p-4 text-red-700">
            <strong>Connection failed</strong>
            <pre className="mt-2 whitespace-pre-wrap text-sm">
              {error}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}
