// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//   DocumentData,
//   QueryDocumentSnapshot,
//   collection,
//   onSnapshot,
//   orderBy,
//   query,
// } from "firebase/firestore";
// import { db } from "@/lib/firebase";
// import { useAuth } from "@/components/AuthProvider";
// import AddSubscriptionForm from "@/components/AddSubscriptionForm";
// import SubscriptionList from "@/components/SubscriptionList";
// import EmptyState from "@/components/EmptyState";
// import type { Subscription } from "@/types/subscription";

// export default function DashboardPage() {
//   const { user, loading: authLoading } = useAuth();
//   const router = useRouter();

//   const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
//   const [listLoading, setListLoading] = useState(true);

//   useEffect(() => {
//     if (!authLoading && !user) {
//       router.replace("/");
//     }
//   }, [authLoading, router, user]);

//   useEffect(() => {
//     if (!user) {
//       setSubscriptions([]);
//       return;
//     }

//     const subscriptionsRef = collection(db, "users", user.uid, "subscriptions");
//     const q = query(subscriptionsRef, orderBy("nextRenewalDate", "asc"));

//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const mapped = snapshot.docs.map(
//         (docSnap: QueryDocumentSnapshot<DocumentData>) => {
//           const data = docSnap.data();
//           return {
//             id: docSnap.id,
//             name: data.name as string,
//             amount: Number(data.amount ?? 0),
//             billingCycle: (data.billingCycle ?? "monthly") as Subscription["billingCycle"],
//             nextRenewalDate: (data.nextRenewalDate ?? "") as string,
//             createdAt: data.createdAt?.toString(),
//           } satisfies Subscription;
//         },
//       );

//       setSubscriptions(mapped);
//       setListLoading(false);
//     });

//     return () => unsubscribe();
//   }, [user]);

//   const totalMonthly = useMemo(() => {
//     return subscriptions.reduce((sum, sub) => {
//       if (!Number.isFinite(sub.amount)) return sum;
//       if (sub.billingCycle === "monthly") {
//         return sum + sub.amount;
//       }
//       return sum + sub.amount / 12;
//     }, 0);
//   }, [subscriptions]);

//   if (authLoading || (user && listLoading)) {
//     return (
//       <div className="dashboard-loading">
//         <div>Loading your subscriptions…</div>
//         <div className="loading-dot-row" aria-hidden="true">
//           <div className="loading-dot" />
//           <div className="loading-dot" />
//           <div className="loading-dot" />
//         </div>
//       </div>
//     );
//   }

//   if (!user) {
//     // Redirect is handled by the effect above.
//     return null;
//   }

//   return (
//     <div className="dashboard">
//       <header className="dashboard-header">
//         <h1 className="dashboard-title">Your subscriptions</h1>
//         <p className="dashboard-subtitle">
//           A single list of recurring costs, ordered by what&apos;s coming next.
//           Add the things you actually pay for, not everything a bank feed guesses.
//         </p>
//         <div className="dashboard-metrics">
//           <div className="dashboard-metric-pill">
//             Approx. monthly total ·{" "}
//             {new Intl.NumberFormat(undefined, {
//               style: "currency",
//               currency: "USD",
//               minimumFractionDigits: 0,
//               maximumFractionDigits: 2,
//             }).format(totalMonthly)}
//           </div>
//           <div className="dashboard-metric-pill">
//             {subscriptions.length === 0
//               ? "No renewals tracked yet"
//               : `${subscriptions.length} ${subscriptions.length === 1 ? "active subscription" : "active subscriptions"}`}
//           </div>
//         </div>
//       </header>

//       <div className="dashboard-columns">
//         <section className="dashboard-panel">
//           <div className="dashboard-panel-header">
//             <div>
//               <h2 className="dashboard-panel-title">Add a subscription</h2>
//               <p className="dashboard-panel-subtitle">
//                 Capture the essentials: name, amount, cadence, and next date.
//               </p>
//             </div>
//           </div>
//           <AddSubscriptionForm userId={user.uid} />
//         </section>

//         <section className="dashboard-panel">
//           <div className="dashboard-panel-header">
//             <div>
//               <h2 className="dashboard-panel-title">Upcoming renewals</h2>
//               <p className="dashboard-panel-subtitle">
//                 We keep this list ordered by the next renewal date.
//               </p>
//             </div>
//           </div>
//           {subscriptions.length === 0 ? (
//             <EmptyState />
//           ) : (
//             <SubscriptionList userId={user.uid} subscriptions={subscriptions} />
//           )}
//         </section>
//       </div>
//     </div>
//   );
// }




export default function Home() {
  return (
    <main>
      <h1>Track subscriptions. Know what's coming.</h1>
    </main>
  )
}
