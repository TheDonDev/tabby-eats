
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type TestResult = {
  categories: number;
  meals: number;
};

export default function DatabaseTestPage() {
  const [result, setResult] = useState<TestResult | null>(null);
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

        setResult({
          categories: categoriesResult.count ?? 0,
          meals: mealsResult.count ?? 0,
        });
      } catch (err: unknown) {
        const dbError = err as {
          message?: string;
          code?: string;
          details?: string;
          hint?: string;
        };

        setError(
          [
            `Message: ${dbError.message ?? "No message provided"}`,
            `Code: ${dbError.code ?? "Not provided"}`,
            `Details: ${dbError.details ?? "Not provided"}`,
            `Hint: ${dbError.hint ?? "Not provided"}`,
          ].join("\n")
        );

        console.error("Tabby Eats Supabase diagnostic:", err);
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

        {result && (
          <div className="mt-8 space-y-4">
            <div className="rounded-xl bg-green-50 p-4 text-green-800">
              <strong>Database connected successfully!</strong>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-orange-50 p-4">
                <p className="text-sm text-gray-600">Food categories</p>
                <p className="text-3xl font-bold">
                  {result.categories}
                </p>
              </div>

              <div className="rounded-xl bg-orange-50 p-4">
                <p className="text-sm text-gray-600">Meals</p>
                <p className="text-3xl font-bold">
                  {result.meals}
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-8 rounded-xl bg-red-50 p-4 text-red-700">
            <strong>Database request failed</strong>
            <pre className="mt-3 whitespace-pre-wrap break-words text-sm">
              {error}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}
