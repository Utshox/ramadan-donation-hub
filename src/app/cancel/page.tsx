import Link from "next/link";

export default function CancelPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-4">
            <div className="max-w-md w-full bg-white dark:bg-surface-dark rounded-3xl p-8 text-center shadow-2xl border border-slate-100 dark:border-slate-800">
                <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="material-symbols-outlined text-4xl text-red-500">cancel</span>
                </div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Donation Cancelled</h1>
                <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                    Your checkout was cancelled and no charges were made. If you experienced an issue, please try again.
                </p>
                <Link
                    href="/"
                    className="inline-block bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-3 px-8 rounded-xl transition-all hover:opacity-90"
                >
                    Try Again
                </Link>
            </div>
        </div>
    );
}
