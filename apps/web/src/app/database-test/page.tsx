
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

        const [categories, meals] = await Promise.all([
          supabase
            .from("categories")
            .select("*", { count: "exact", head: true }),

          supabase
            .from("meals")
            .select("*", { count: "exact", head: true }),
        ]);

        if (categories.error) {
          throw categories.error;
        }

        if (meals.error) {
          throw meals.error;
        }

        setResult({
          categories: categories.count ?? 0,
          meals: meals.count ?? 0,
        });
      } catch (err: unknown) {
        if (typeof err === "object" && err !== null) {
          const e = err as Record<string, unknown>;

          console.error("Supabase connection error:", err);

          setError(
            [
              `Message: ${String(e.message ?? "Unknown error")}`,
              `Code: ${String(e.code ?? "Not provided")}`,
              `Details: ${String(e.details ?? "Not provided")}`,
              `Hint: ${String(e.hint ?? "Not provided")}`,
            ].join("\n")
          );
        } else {
          setError(String(err));
        }
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
                <p className="text-3xl font-bold">{result.categories}</p>
              </div>

              <div className="rounded-xl bg-orange-50 p-4">
                <p className="text-sm text-gray-600">Meals</p>
                <p className="text-3xl font-bold">{result.meals}</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-8 rounded-xl bg-red-50 p-4 text-red-700">
            <strong>Connection failed</strong>
            <pre className="mt-3 whitespace-pre-wrap text-sm">
              {error}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}
