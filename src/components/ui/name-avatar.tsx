import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { initials } from '@/lib/format'
import { cn } from '@/lib/utils'

const SIZE = {
  sm: 'size-6 text-[10px]',
  md: 'size-9 text-xs',
  lg: 'size-11 text-sm',
}

interface NameAvatarProps {
  name: string
  size?: keyof typeof SIZE
  className?: string
}

/** Avatar com iniciais sobre o azul da marca. */
export function NameAvatar({ name, size = 'md', className }: NameAvatarProps) {
  return (
    <Avatar className={cn(SIZE[size], className)}>
      <AvatarFallback className="bg-primary font-semibold text-primary-foreground">
        {initials(name)}
      </AvatarFallback>
    </Avatar>
  )
}
