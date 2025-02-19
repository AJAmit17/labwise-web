export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center space-y-6 p-8">
                <svg
                    className="mx-auto w-48 h-48"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"
                        fill="#EF4444"
                    />
                </svg>
                
                <h1 className="text-4xl font-bold text-primary">
                    Nice Try! 🕵️‍♂️
                </h1>
                
                <p className="text-xl text-primary max-w-md mx-auto">
                    But this area is for teachers only. Students aren&apos;t allowed to mess with the controls!
                </p>
                
                <div className="text-lg font-medium text-primary">
                    Error 401: Unauthorized Access
                </div>
                
                <a 
                    href="/dashboard"
                    className="inline-block px-6 py-3 bg-accent rounded-lg hover:bg-accent-dark transition-colors"
                >
                    Back to Safe Zone
                </a>

                <div className="text-sm text-primary mt-8">
                    PS: Don&apos;t worry, we won&apos;t tell your teachers about this attempt 😉
                </div>
            </div>
        </div>
    )
}
