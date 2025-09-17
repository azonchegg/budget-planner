import React, { useRef } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../lib/utils'
import { ChevronDown } from 'lucide-react'

interface SelectProps {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
}

interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

interface SelectContentProps {
  children: React.ReactNode
}

interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  children: React.ReactNode
}

const SelectContext = React.createContext<{
  value: string
  onValueChange: (value: string) => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  parentRef: React.MutableRefObject<HTMLDivElement | null>
}>({
  value: '',
  onValueChange: () => {},
  isOpen: false,
  setIsOpen: () => {},
  parentRef: { current: null }
})

const Select = ({ value, onValueChange, children }: SelectProps) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const parentRef = React.useRef<HTMLDivElement | null>(null)

  return (
    <SelectContext.Provider value={{ value, onValueChange, isOpen, parentRef, setIsOpen }}>
      <div className="relative" ref={parentRef}>
        {children}
      </div>
    </SelectContext.Provider>
  )
}

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const { isOpen, setIsOpen } = React.useContext(SelectContext)
    const internalRef = React.useRef<HTMLButtonElement>(null)

    // Combine refs
    React.useImperativeHandle(ref, () => internalRef.current!)

    return (
      <button
        type="button"
        ref={internalRef}
        className={cn(
          'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        onClick={() => setIsOpen(!isOpen)}
        data-select-trigger
        {...props}
      >
        {children}
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>
    )
  }
)
SelectTrigger.displayName = 'SelectTrigger'

const SelectValue = ({ placeholder }: { placeholder?: string }) => {
  const { value } = React.useContext(SelectContext)
  return <span>{value || placeholder}</span>
}

const SelectContent = ({ children }: SelectContentProps) => {
  const { isOpen, parentRef, setIsOpen } = React.useContext(SelectContext)
  const [position, setPosition] = React.useState({ top: 0, left: 0, width: 0 })

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (isOpen && !target.closest('[data-select-content]') && !target.closest('[data-select-trigger]')) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, setIsOpen])

  React.useEffect(() => {
    if (isOpen) {
      const updatePosition = () => {
        const trigger = document.querySelector('[data-select-trigger]') as HTMLElement
        if (trigger) {
          const rect = trigger.getBoundingClientRect()
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop
          const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft

          setPosition({
            top: rect.bottom + scrollTop + 4,
            left: rect.left + scrollLeft,
            width: rect.width
          })
        }
      }

      // Small delay to ensure DOM is ready
      setTimeout(updatePosition, 0)

      // Update position on scroll
      window.addEventListener('scroll', updatePosition, true)
      window.addEventListener('resize', updatePosition)

      return () => {
        window.removeEventListener('scroll', updatePosition, true)
        window.removeEventListener('resize', updatePosition)
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  const content = (
    <div
      className="absolute z-[9999] min-w-[8rem] max-h-60 overflow-y-auto rounded-md border bg-white p-1 text-popover-foreground shadow-xl scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
      data-select-content
      style={{
        width: `${position.width}px`,
        zIndex: 9999,
        backgroundColor: 'white',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}
    >
      {children}
    </div>
  )

  return createPortal(content, parentRef.current ?? document.body)
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, value, children, ...props }, ref) => {
    const { onValueChange, setIsOpen } = React.useContext(SelectContext)

    const handleClick = () => {
      onValueChange(value)
      setIsOpen(false)
    }

    return (
      <div
        ref={ref}
        className={cn(
          'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {children}
      </div>
    )
  }
)
SelectItem.displayName = 'SelectItem'

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }
