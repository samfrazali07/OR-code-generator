import React from 'react';
import type { TicketRecord } from '../types/ticket';
import { EmptyState } from './EmptyState';

interface TicketListProps {
  tickets: TicketRecord[];
  selectedTicketId: string | null;
  onSelectTicket: (ticket: TicketRecord) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
}

export const TicketList: React.FC<TicketListProps> = ({
  tickets,
  selectedTicketId,
  onSelectTicket,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}) => {
  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.attendeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.attendeeEmail.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || ticket.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <section className="list-card" aria-labelledby="directory-heading">
      <div className="card-header">
        <h2 id="directory-heading" className="card-title">
          Generated Ticket Directory
        </h2>
        <p className="card-subtitle">
          Review, filter, and inspect issued tickets and digital QR artifacts.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-controls">
        <div className="search-group">
          <label htmlFor="searchTickets" className="filter-label">
            Search tickets
          </label>
          <input
            id="searchTickets"
            type="search"
            className="filter-input"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by ticket #, attendee, event..."
          />
        </div>

        <div className="status-group">
          <label htmlFor="filterStatus" className="filter-label">
            Filter Status
          </label>
          <select
            id="filterStatus"
            className="filter-select"
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="ISSUED">Issued</option>
            <option value="CHECKED_IN">Checked In</option>
            <option value="DRAFT">Draft</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Content or Empty State */}
      {filteredTickets.length === 0 ? (
        <EmptyState
          message="No data found"
          description={
            searchQuery.trim()
              ? `No ticket records match query "${searchQuery}". Try adjusting your keywords.`
              : 'No tickets currently registered in the database directory.'
          }
        />
      ) : (
        <ul className="ticket-item-list" aria-label="Issued tickets directory">
          {filteredTickets.map((ticket) => {
            const isSelected = ticket.id === selectedTicketId;
            return (
              <li key={ticket.id} className="ticket-item-wrapper">
                <button
                  type="button"
                  onClick={() => onSelectTicket(ticket)}
                  className={`ticket-item-button ${isSelected ? 'item-selected' : ''}`}
                  aria-pressed={isSelected}
                  aria-label={`View ticket ${ticket.ticketNumber} for ${ticket.attendeeName}`}
                >
                  <div className="item-row-top">
                    <span className="item-ticket-number">{ticket.ticketNumber}</span>
                    <span className={`status-badge status-${ticket.status.toLowerCase()}`}>
                      {ticket.status}
                    </span>
                  </div>
                  <div className="item-row-mid">
                    <span className="item-attendee">{ticket.attendeeName}</span>
                    <span className="item-event">{ticket.eventName}</span>
                  </div>
                  <div className="item-row-bottom">
                    <span className="item-tier">{ticket.ticketType} &bull; ${ticket.price.toFixed(2)} {ticket.currency}</span>
                    <span className="item-date">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};
