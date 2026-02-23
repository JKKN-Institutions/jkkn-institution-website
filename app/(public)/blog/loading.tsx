import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

function BlogCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video bg-muted animate-pulse" />
      <CardHeader className="pb-2">
        <div className="h-5 bg-muted rounded animate-pulse mb-2" />
        <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
        <div className="h-4 bg-muted rounded animate-pulse w-1/2 mt-1" />
      </CardHeader>
      <CardFooter className="pt-0">
        <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
      </CardFooter>
    </Card>
  )
}

function SidebarSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="h-5 bg-muted rounded animate-pulse w-20" />
        </CardHeader>
        <CardContent>
          <div className="h-10 bg-muted rounded animate-pulse" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="h-5 bg-muted rounded animate-pulse w-24" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-4 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Hero skeleton */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="h-12 bg-muted rounded animate-pulse mx-auto w-48" />
            <div className="h-5 bg-muted rounded animate-pulse mx-auto w-96 max-w-full" />
          </div>
        </div>
      </section>

      {/* Content skeleton */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3 order-2 lg:order-1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 9 }).map((_, i) => (
                  <BlogCardSkeleton key={i} />
                ))}
              </div>
            </div>
            <div className="lg:col-span-1 order-1 lg:order-2">
              <SidebarSkeleton />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
