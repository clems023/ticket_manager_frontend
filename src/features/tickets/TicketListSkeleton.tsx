import { Card, CardContent } from "../../components/ui";

export function TicketListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <ul className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <li key={i}>
          <Card className="dark:border-gray-700 dark:bg-gray-800">
            <CardContent className="py-4">
              <div className="flex justify-between gap-2">
                <div className="h-5 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                <div className="flex gap-2">
                  <div className="h-5 w-16 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
                  <div className="h-5 w-16 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
                </div>
              </div>
              <div className="mt-3 h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              <div className="mt-2 h-4 w-4/5 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              <div className="mt-3 h-3 w-1/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}
