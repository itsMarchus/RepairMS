export default function layout({children}: {children: React.ReactNode}) {
    return (
        <div className="relative">
            {children}
        </div>
    )
}