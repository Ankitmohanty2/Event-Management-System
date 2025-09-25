"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { listEvents } from "@/lib/api";
import EventCard from "@/components/EventCard";
import Pagination from "@/components/ui/Pagination";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function EventsPage() {
  const [eventsData, setEventsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9); // 3x3 grid
  const { user } = useAuth();
  const loginCTA = (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Please log in to view events</h1>
        <p className="text-gray-600 mb-6">You need an account to browse event details.</p>
        <div className="flex items-center justify-center gap-3">
          <Link className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700" href="/login">Login</Link>
          <Link className="px-5 py-2 rounded-lg border" href="/signup">Sign Up</Link>
        </div>
      </div>
    </div>
  );
  const router = useRouter();

  useEffect(() => {
    loadEvents();
  }, [currentPage, pageSize]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listEvents(currentPage, pageSize);
      setEventsData(data);
    } catch (err) {
      setError("Failed to load events. Please try again.");
      console.error("Error loading events:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };



  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">All Events</h1>
          {user?.role === "admin" && (
            <Link 
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" 
              href="/admin/events"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Manage Events
            </Link>
          )}
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading events...</p>
          </div>
        </div>
      </div>
    );
  }


  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">All Events</h1>
          {user?.role === "admin" && (
            <a 
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" 
              href="/admin/events"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Manage Events
            </a>
          )}
        </div>
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to Load Events</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button 
            onClick={loadEvents}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const events = eventsData?.events || [];
  const pagination = eventsData?.pagination;


  if (!user) return loginCTA;

  return (
    <div className="space-y-6">
     
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">🎉 All Events</h1>
            <p className="text-blue-100 text-lg">
              {user 
                ? `Welcome back, ${user.name}! Discover amazing events happening around you`
                : "Discover amazing events happening around you"
              }
            </p>
          </div>
          <div className="flex flex-col gap-3">
          {user?.role === "admin" && (
              <Link 
                className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-colors font-semibold shadow-lg" 
                href="/admin/events"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Manage Events
              </Link>
            )}
            {!user && (
              <div className="flex gap-2">
                <Link 
                  className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors" 
                  href="/login"
                >
                  Login
                </Link>
                <Link 
                  className="inline-flex items-center px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold" 
                  href="/signup"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>


      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-wrap gap-y-3">
            <div className="flex items-center space-x-2">
              <label htmlFor="pageSize" className="text-sm font-medium text-gray-700">Events per page:</label>
              <select
                id="pageSize"
                value={pageSize}
                onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value={6}>6</option>
                <option value={9}>9</option>
                <option value={12}>12</option>
                <option value={18}>18</option>
              </select>
            </div>
            {pagination && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">{pagination.total_count}</span> total events
              </div>
            )}
          </div>
          <button 
            onClick={loadEvents}
            className="inline-flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

          {events.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
          <div className="text-gray-400 mb-6">
            <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No Events Yet</h3>
          <p className="text-gray-500 text-lg mb-6">
            {user?.role === "admin" 
              ? "Create your first event to get started!" 
              : "Check back later for exciting events."
            }
          </p>
          {user?.role === "admin" && (
            <Link 
              href="/admin/events"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Event
            </Link>
          )}
        </div>
      ) : (
        <>
       
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div key={event.id} className="transform-gpu transition duration-300 hover:scale-[1.03] hover:shadow-xl">
                <EventCard event={event} />
              </div>
            ))}
          </div>
          
    
          {pagination && pagination.total_pages > 1 && (
            <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.total_pages}
                onPageChange={handlePageChange}
                hasNext={pagination.has_next}
                hasPrev={pagination.has_prev}
                totalCount={pagination.total_count}
                pageSize={pagination.page_size}
              />
            </div>
          )}
        </>
      )}

    </div>
  );
}
