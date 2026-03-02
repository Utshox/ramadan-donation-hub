import Link from "next/link";

export default function SuccessPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-4">
            <div className="max-w-md w-full bg-white dark:bg-surface-dark rounded-3xl p-8 text-center shadow-2xl border border-slate-100 dark:border-slate-800">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="material-symbols-outlined text-4xl text-primary">check_circle</span>
                </div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Jazakallah Khair!</h1>
                <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                    Your generous donation has been received successfully. May Allah reward you abundantly and multiply your blessings.
                </p>
                <Link
                    href="/"
                    className="inline-block bg-primary hover:bg-primary-dark text-slate-900 font-bold py-3 px-8 rounded-xl transition-all shadow-lg hover:shadow-primary/40"
                >
                    Return Home
                </Link>
            </div>
        </div>
    );
}
