interface HeaderI {
  heading: string
  subheading?: string
}

export const Header = ({ heading, subheading }: HeaderI) => {
  return (
    <div className="space-y-2">
      <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
        {heading}
      </h1>
      <p className="text-lg text-muted-foreground">
        <span
          data-br=":r4:"
          data-brr="1"
          // style="display: inline-block; vertical-align: top; text-decoration: inherit; max-width: 367px;"
        >
          {subheading || ''}
        </span>
      </p>
    </div>
  )
}
