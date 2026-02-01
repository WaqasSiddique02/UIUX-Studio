"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarGroupContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  SidebarRail
} from "@/components/ui/sidebar"
import { ProjectType } from "@/type/types"
import { FolderIcon, Loader2Icon, PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export function ProjectsSidebar() {
  const [projects, setProjects] = useState<ProjectType[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { isSignedIn } = useUser()

  useEffect(() => {
    if (isSignedIn) {
      fetchProjects()
    } else {
      setLoading(false)
    }
  }, [isSignedIn])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/project')
      const data = await response.json()
      if (data.projects) {
        setProjects(data.projects)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleProjectClick = (projectId: string) => {
    router.push(`/project/${projectId}`)
  }

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <FolderIcon className="h-5 w-5" />
          <span className="font-semibold group-data-[collapsible=icon]:hidden">My Projects</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Recent Projects</SidebarGroupLabel>
          <SidebarGroupContent>
            {!isSignedIn ? (
              <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                Sign in to see your projects
              </div>
            ) : loading ? (
              <div className="space-y-2 px-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : projects.length === 0 ? (
              <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                No projects yet
              </div>
            ) : (
              <SidebarMenu>
                {projects.map((project) => (
                  <SidebarMenuItem key={project.id}>
                    <SidebarMenuButton
                      onClick={() => handleProjectClick(project.projectId)}
                      tooltip={project.projectName || project.userInput || "Untitled Project"}
                      className="cursor-pointer"
                    >
                      <FolderIcon className="h-4 w-4" />
                      <span className="truncate">
                        {project.projectName || project.userInput || "Untitled Project"}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="p-2">
          <Button 
            variant="outline" 
            className="w-full justify-start gap-2"
            onClick={() => router.push('/')}
            size="sm"
          >
            <PlusIcon className="h-4 w-4" />
            <span>New Project</span>
          </Button>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
