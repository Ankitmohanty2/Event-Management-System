"use client";
import { useState, useEffect } from "react";
import { updateEvent } from "@/lib/api";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import Textarea from "@/components/ui/Textarea";
import ImageUpload from "@/components/ImageUpload";

export default function EditEventModal({ isOpen, onClose, event, onEventUpdated }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    image_url: ""
  });
  const [submitting, setSubmitting] = useState(false);

  // Initialize form with event data when modal opens
  useEffect(() => {
    if (event && isOpen) {
      setForm({
        title: event.title || "",
        description: event.description || "",
        date: event.date || "",
        time: event.time || "",
        image_url: event.image_url || ""
      });
    }
  }, [event, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.title || !form.description || !form.date || !form.time) {
      alert("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      // Prepare the update payload - only send fields that are different from original
      const updatePayload = {};
      
      if (form.title !== event.title) {
        updatePayload.title = form.title;
      }
      if (form.description !== event.description) {
        updatePayload.description = form.description;
      }
      if (form.date !== event.date) {
        updatePayload.date = form.date;
      }
      if (form.time !== event.time) {
        updatePayload.time = form.time;
      }
      if (form.image_url !== event.image_url) {
        updatePayload.image_url = form.image_url;
      }

      console.log("Sending update payload:", updatePayload);
      const updatedEvent = await updateEvent(event.id, updatePayload);
      if (updatedEvent) {
        onEventUpdated(updatedEvent);
        onClose();
        alert("Event updated successfully!");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert(error.message || "Failed to update event");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      onClose();
    }
  };

  if (!event) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Event" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Event Title *</Label>
            <Input 
              id="edit-title" 
              placeholder="Enter event title" 
              value={form.title} 
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              disabled={submitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-date">Date *</Label>
            <Input 
              id="edit-date" 
              type="date" 
              value={form.date} 
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
              disabled={submitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-time">Time *</Label>
            <Input 
              id="edit-time" 
              type="time" 
              value={form.time} 
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              required
              disabled={submitting}
            />
          </div>
          <div className="space-y-2">
            <Label>Event Image</Label>
            <ImageUpload 
              onImageUpload={(url) => setForm({ ...form, image_url: url })} 
              currentImage={form.image_url}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="edit-description">Description *</Label>
          <Textarea 
            id="edit-description" 
            placeholder="Describe your event..." 
            value={form.description} 
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
            required
            disabled={submitting}
          />
        </div>

        {/* Current Event Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Current Event Details</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">ID:</span>
              <span className="ml-2 font-medium">{event.id}</span>
            </div>
            <div>
              <span className="text-gray-500">Created:</span>
              <span className="ml-2 font-medium">
                {new Date(event.created_at).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Last Updated:</span>
              <span className="ml-2 font-medium">
                {new Date(event.updated_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleClose}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={submitting}
            className="min-w-[120px]"
          >
            {submitting ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Updating...
              </div>
            ) : (
              "Update Event"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
