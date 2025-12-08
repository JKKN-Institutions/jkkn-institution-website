'use client'

import { useState } from 'react'
import { ShadcnButtonBlock } from '@/components/cms-blocks/shadcn/button-block'
import { ShadcnCardBlock } from '@/components/cms-blocks/shadcn/card-block'
import { ShadcnAlertBlock } from '@/components/cms-blocks/shadcn/alert-block'
import { ShadcnBadgeBlock } from '@/components/cms-blocks/shadcn/badge-block'
import { ShadcnInputBlock } from '@/components/cms-blocks/shadcn/input-block'
import { ShadcnTextareaBlock } from '@/components/cms-blocks/shadcn/textarea-block'
import { ShadcnCheckboxBlock } from '@/components/cms-blocks/shadcn/checkbox-block'
import { ShadcnSwitchBlock } from '@/components/cms-blocks/shadcn/switch-block'
import { ShadcnSliderBlock } from '@/components/cms-blocks/shadcn/slider-block'
import { ShadcnProgressBlock } from '@/components/cms-blocks/shadcn/progress-block'
import { ShadcnSeparatorBlock } from '@/components/cms-blocks/shadcn/separator-block'
import { ShadcnAvatarBlock } from '@/components/cms-blocks/shadcn/avatar-block'
import { ShadcnTabsBlock } from '@/components/cms-blocks/shadcn/tabs-block'
import { ShadcnBreadcrumbBlock } from '@/components/cms-blocks/shadcn/breadcrumb-block'
import { ShadcnTooltipBlock } from '@/components/cms-blocks/shadcn/tooltip-block'
import { ShadcnAccordionBlock } from '@/components/cms-blocks/shadcn/accordion-block'
import { ShadcnCollapsibleBlock } from '@/components/cms-blocks/shadcn/collapsible-block'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Toggle } from '@/components/ui/toggle'
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from '@/components/ui/command'
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Bold, Italic, Download } from 'lucide-react'

/**
 * Preview Capture Page for shadcn/ui Components
 *
 * This page renders all shadcn components for screenshot capture.
 * Navigate to /admin/preview-capture/shadcn to view this page.
 *
 * Screenshots should be captured at 320x240px for consistency.
 */

interface PreviewCardProps {
  name: string
  children: React.ReactNode
}

function PreviewCard({ name, children }: PreviewCardProps) {
  return (
    <div className="flex flex-col gap-2" data-component={name}>
      <div className="text-xs font-mono text-muted-foreground">{name}</div>
      <div
        id={`preview-${name}`}
        className="w-[320px] h-[240px] border rounded-lg bg-white flex items-center justify-center p-4 overflow-hidden"
      >
        <div className="w-full">{children}</div>
      </div>
    </div>
  )
}

export default function ShadcnPreviewCapturePage() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">shadcn/ui Component Preview Capture</h1>
          <p className="text-muted-foreground">
            Each component is rendered in a 320x240px container for screenshot capture.
            Use Chrome DevTools or a screenshot tool to capture each component.
          </p>
          <Button className="mt-4 gap-2" variant="outline">
            <Download className="h-4 w-4" />
            Save to /public/cms-previews/shadcn/
          </Button>
        </div>

        {/* Form Components */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Form Components</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <PreviewCard name="Button">
              <div className="flex flex-col gap-2 items-center">
                <ShadcnButtonBlock text="Primary Button" variant="default" />
                <ShadcnButtonBlock text="Secondary" variant="secondary" />
                <ShadcnButtonBlock text="Outline" variant="outline" />
                <ShadcnButtonBlock text="Ghost" variant="ghost" />
              </div>
            </PreviewCard>

            <PreviewCard name="Input">
              <ShadcnInputBlock label="Email" placeholder="Enter your email..." type="email" />
            </PreviewCard>

            <PreviewCard name="Textarea">
              <ShadcnTextareaBlock label="Message" placeholder="Type your message here..." rows={3} />
            </PreviewCard>

            <PreviewCard name="Select">
              <div className="space-y-2">
                <Label>Select Option</Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a fruit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="orange">Orange</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </PreviewCard>

            <PreviewCard name="Checkbox">
              <div className="space-y-3">
                <ShadcnCheckboxBlock label="Accept terms and conditions" checked />
                <ShadcnCheckboxBlock label="Subscribe to newsletter" />
                <ShadcnCheckboxBlock label="Disabled option" disabled />
              </div>
            </PreviewCard>

            <PreviewCard name="RadioGroup">
              <RadioGroup defaultValue="option-1">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option-1" id="option-1" />
                  <Label htmlFor="option-1">Option One</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option-2" id="option-2" />
                  <Label htmlFor="option-2">Option Two</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option-3" id="option-3" />
                  <Label htmlFor="option-3">Option Three</Label>
                </div>
              </RadioGroup>
            </PreviewCard>

            <PreviewCard name="Switch">
              <div className="space-y-4">
                <ShadcnSwitchBlock label="Airplane Mode" checked />
                <ShadcnSwitchBlock label="Notifications" />
                <ShadcnSwitchBlock label="Disabled" disabled />
              </div>
            </PreviewCard>

            <PreviewCard name="Slider">
              <ShadcnSliderBlock label="Volume" min={0} max={100} defaultValue={75} />
            </PreviewCard>

            <PreviewCard name="Toggle">
              <div className="flex gap-2 items-center justify-center">
                <Toggle aria-label="Toggle bold">
                  <Bold className="h-4 w-4" />
                </Toggle>
                <Toggle aria-label="Toggle italic" variant="outline">
                  <Italic className="h-4 w-4" />
                </Toggle>
              </div>
            </PreviewCard>

            <PreviewCard name="DatePicker">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Date Picker</p>
                <Button variant="outline" className="w-full">
                  {date ? date.toLocaleDateString() : 'Pick a date'}
                </Button>
              </div>
            </PreviewCard>
          </div>
        </section>

        {/* Display Components */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Display Components</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <PreviewCard name="Card">
              <ShadcnCardBlock
                title="Card Title"
                description="Card description text"
                content="This is the main content of the card component."
              />
            </PreviewCard>

            <PreviewCard name="Badge">
              <div className="flex flex-wrap gap-2 justify-center">
                <ShadcnBadgeBlock text="Default" variant="default" />
                <ShadcnBadgeBlock text="Secondary" variant="secondary" />
                <ShadcnBadgeBlock text="Destructive" variant="destructive" />
                <ShadcnBadgeBlock text="Outline" variant="outline" />
              </div>
            </PreviewCard>

            <PreviewCard name="Avatar">
              <div className="flex gap-4 items-center justify-center">
                <ShadcnAvatarBlock fallback="JD" size="sm" />
                <ShadcnAvatarBlock fallback="AB" size="md" />
                <ShadcnAvatarBlock fallback="CN" size="lg" />
              </div>
            </PreviewCard>

            <PreviewCard name="Alert">
              <ShadcnAlertBlock
                title="Heads up!"
                description="You can add components to your app using the CLI."
                variant="default"
              />
            </PreviewCard>

            <PreviewCard name="Progress">
              <div className="space-y-4">
                <ShadcnProgressBlock value={25} showLabel />
                <ShadcnProgressBlock value={50} showLabel />
                <ShadcnProgressBlock value={75} showLabel />
              </div>
            </PreviewCard>

            <PreviewCard name="Skeleton">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              </div>
            </PreviewCard>

            <PreviewCard name="Separator">
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium">Above separator</div>
                  <ShadcnSeparatorBlock orientation="horizontal" />
                  <div className="text-sm text-muted-foreground">Below separator</div>
                </div>
              </div>
            </PreviewCard>

            <PreviewCard name="AspectRatio">
              <AspectRatio ratio={16 / 9} className="bg-muted rounded-md flex items-center justify-center">
                <span className="text-muted-foreground">16:9</span>
              </AspectRatio>
            </PreviewCard>
          </div>
        </section>

        {/* Navigation Components */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Navigation Components</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <PreviewCard name="Tabs">
              <ShadcnTabsBlock
                tabs={[
                  { value: 'tab1', label: 'Account', content: 'Account settings' },
                  { value: 'tab2', label: 'Password', content: 'Password settings' },
                  { value: 'tab3', label: 'Team', content: 'Team settings' },
                ]}
              />
            </PreviewCard>

            <PreviewCard name="NavigationMenu">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Components</NavigationMenuTrigger>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </PreviewCard>

            <PreviewCard name="Breadcrumb">
              <ShadcnBreadcrumbBlock
                items={[
                  { label: 'Home', href: '/' },
                  { label: 'Documents', href: '/documents' },
                  { label: 'Current Page' },
                ]}
              />
            </PreviewCard>

            <PreviewCard name="Pagination">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </PreviewCard>

            <PreviewCard name="ContextMenu">
              <div className="text-center">
                <div className="border-2 border-dashed rounded-lg p-8 text-muted-foreground">
                  Right-click here
                </div>
              </div>
            </PreviewCard>

            <PreviewCard name="DropdownMenu">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Open Menu</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </PreviewCard>
          </div>
        </section>

        {/* Feedback Components */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Feedback Components</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <PreviewCard name="Dialog">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Open Dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Dialog Title</DialogTitle>
                    <DialogDescription>Dialog description here.</DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button>Save</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </PreviewCard>

            <PreviewCard name="Sheet">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline">Open Sheet</Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Sheet Title</SheetTitle>
                    <SheetDescription>Sheet description here.</SheetDescription>
                  </SheetHeader>
                </SheetContent>
              </Sheet>
            </PreviewCard>

            <PreviewCard name="Popover">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">Open Popover</Button>
                </PopoverTrigger>
                <PopoverContent>
                  <p>Popover content goes here.</p>
                </PopoverContent>
              </Popover>
            </PreviewCard>

            <PreviewCard name="Tooltip">
              <ShadcnTooltipBlock triggerText="Hover me" content="This is a tooltip" side="top" />
            </PreviewCard>

            <PreviewCard name="AlertDialog">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Delete</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </PreviewCard>

            <PreviewCard name="HoverCard">
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="link">@shadcn</Button>
                </HoverCardTrigger>
                <HoverCardContent>
                  <div className="text-sm">
                    <p className="font-semibold">shadcn</p>
                    <p className="text-muted-foreground">Creator of shadcn/ui</p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </PreviewCard>
          </div>
        </section>

        {/* Data Components */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Data Components</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <PreviewCard name="Table">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>John Doe</TableCell>
                    <TableCell>Active</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Jane Smith</TableCell>
                    <TableCell>Pending</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </PreviewCard>

            <PreviewCard name="Calendar">
              <div className="scale-75 origin-center">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
              </div>
            </PreviewCard>

            <PreviewCard name="Carousel">
              <Carousel className="w-full max-w-xs mx-auto">
                <CarouselContent>
                  {[1, 2, 3].map((item) => (
                    <CarouselItem key={item}>
                      <div className="p-1">
                        <div className="flex aspect-square items-center justify-center p-6 bg-muted rounded-lg">
                          <span className="text-4xl font-semibold">{item}</span>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </PreviewCard>

            <PreviewCard name="Collapsible">
              <ShadcnCollapsibleBlock
                triggerText="Collapsible Section"
                content="This content can be shown or hidden."
                defaultOpen
              />
            </PreviewCard>

            <PreviewCard name="Accordion">
              <ShadcnAccordionBlock
                items={[
                  { trigger: 'Section 1', content: 'Content for section 1' },
                  { trigger: 'Section 2', content: 'Content for section 2' },
                  { trigger: 'Section 3', content: 'Content for section 3' },
                ]}
                type="single"
                collapsible
              />
            </PreviewCard>

            <PreviewCard name="Command">
              <Command className="rounded-lg border shadow-md">
                <CommandInput placeholder="Type a command..." />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup heading="Suggestions">
                    <CommandItem>Calendar</CommandItem>
                    <CommandItem>Search</CommandItem>
                    <CommandItem>Settings</CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PreviewCard>
          </div>
        </section>

        {/* Layout Components */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Layout Components</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <PreviewCard name="ScrollArea">
              <ScrollArea className="h-[150px] w-full rounded-md border p-4">
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                    <div key={item} className="text-sm">
                      Scrollable content item {item}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </PreviewCard>

            <PreviewCard name="Resizable">
              <div className="border rounded-lg p-4 text-center">
                <p className="text-sm text-muted-foreground">Resizable Panel</p>
                <p className="text-xs text-muted-foreground mt-1">Drag to resize</p>
              </div>
            </PreviewCard>

            <PreviewCard name="Form">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Username</Label>
                  <ShadcnInputBlock placeholder="Enter username" />
                </div>
                <Button className="w-full">Submit</Button>
              </div>
            </PreviewCard>

            <PreviewCard name="Sidebar">
              <div className="border rounded-lg p-2 bg-muted/50">
                <div className="space-y-1">
                  <div className="px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm">Dashboard</div>
                  <div className="px-3 py-2 text-sm text-muted-foreground hover:bg-muted rounded-md">Settings</div>
                  <div className="px-3 py-2 text-sm text-muted-foreground hover:bg-muted rounded-md">Profile</div>
                </div>
              </div>
            </PreviewCard>
          </div>
        </section>
      </div>
    </div>
  )
}
