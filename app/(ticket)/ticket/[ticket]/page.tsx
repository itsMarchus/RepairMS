import { notFound } from "next/navigation";
import { Suspense } from "react";
import TicketDetails from "@/app/components/ui/tickets/ticketDetail";
import Link from "next/link";
// import { Suspense } from "react"; // this shows the loading state for better UX
import { Button } from "@/app/components/reusable/button";
import { Card } from "@/app/components/reusable/card";
import { Badge } from "@/app/components/reusable/badge";
import { Textarea } from "@/app/components/reusable/textarea";
import { Input } from "@/app/components/reusable/input";
import { Label } from "@/app/components/reusable/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/app/components/reusable/select";
import {
    ArrowLeft,
    Phone,
    Mail,
    Camera,
    QrCode,
    PhilippinePeso,
    Pencil
} from "lucide-react";
import {
    getTicketAlertLevel,
    getTimeUntilDeadline,
} from "@/app/utils/ticketUtils";
import { getStatusFromSlug } from "@/app/utils/statusUtils";
import { toast } from "sonner";
import { useState } from "react"; // using useEffect for mock data fetch and probably later will instead use a promise to fetch to the server side
import { TicketType, TicketStatus, TicketDetailsType } from "@/app/lib/definitions";
import ImageModal from "@/app/components/reusable/imageModal";
import { mockDataTicketDetail } from "@/app/lib/mockdata"; ////////// MOCK DATA/////   

export default async function TicketDetailsPage({
    params,
}: {
    params: Promise<{ ticket_number: string }>;
}) {

    const { ticket_number } = await params;

    if (!ticket_number) {
        notFound();
    } // TODO: add not-found.tsx
    // const { ticket_number } = await params;
    // const ticket_number = 'TKX-023';
    // const [ticket, setTicket] = useState<TicketDetailsType | null>(mockDataTicketDetail);

    // useEffect(() => {
    //     // Mock fetching ticket data
    //     const mockTickets = mockDataTicketCard();
    //     const foundTicket = mockTickets.find(t => t.id === id);
    //     if (foundTicket) {
    //       setTicket(foundTicket);
    //     }
    //   }, [id]);

    // if (!ticket_number || !ticket) {
    //     notFound();
    // } // TODO: add not-found.tsx

    //const alertLevel = getTicketAlertLevel(ticket);

    // const handleStatusChange = async (newStatus: TicketStatus) => {
    //     setTicket({
    //         ...ticket,
    //         status: newStatus,
    //         timeline: { ...ticket.timeline, updated_at: new Date() },
    //     });
    // };

    // const handleSave = async () => {
    //     // TODO: update ticket in the database

    //     // Check the final status AT THE MOMENT OF SAVING
    //     if (ticket.status === "pickup") {
    //         toast.success("Customer Notified", {
    //             description: `SMS sent: "Your ${ticket.device_type} is ready for pickup!"`,
    //         });
    //     } else {
    //         // Generic toast for other status updates
    //         toast.success("Ticket updated successfully");
    //     }

    //     setIsEditing(false);
    // };

    // const alertBorders = {
    //     normal: "border-gray-200",
    //     warning: "border-yellow-400 border-2",
    //     danger: "border-red-400 border-2",
    // };

    try {
        // const ticket = await fetchTicketDetailsByTicketNumber(ticket_number);
        // if (!ticket) {
        //     notFound();
        // }

        return (
            <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
                {/* <Suspense> */}
                    {/* <TicketDetails ticket={ticket} /> */}
                {/* </Suspense> */}
            </main>
        )
    } catch (error) {
        console.error('Error fetching transaction:', error);
        notFound();
    }


    // return (
        // <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
        //     <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200 shadow-sm">
        //         <div className="max-w-6xl mx-auto px-6 py-5">
        //             <div className="flex items-center justify-between">
        //                 <div className="flex items-center gap-4">
        //                     <Link href={`/${ticket.status}`}>
        //                         <Button
        //                             variant="ghost"
        //                             size="sm"
        //                             className="hover:bg-blue-50"
        //                         >
        //                             <ArrowLeft className="size-4 mr-2" />
        //                             Back
        //                         </Button>
        //                     </Link>
        //                     <div>
        //                         <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
        //                             {ticket.ticket_number}
        //                         </h1>
        //                         <p className="text-sm text-slate-600">
        //                             {ticket.customer_name}
        //                         </p>
        //                     </div>
        //                 </div>
        //                 <div className="flex gap-2">
        //                     <Link href={`/checkout/${ticket.id}`}>
        //                         <Button
        //                             variant="outline"
        //                             className="hover:bg-blue-50 hover:border-blue-200"
        //                         >
        //                             <QrCode className="size-4 md:mr-2" />
        //                             <span className="hidden md:block">Checkout</span>
        //                         </Button>
        //                     </Link>
        //                     {/* {isEditing ? (
        //                         <Button
        //                             onClick={handleSave}
        //                             className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 shadow-lg shadow-blue-500/30"
        //                         >
        //                             <Save className="size-4 mr-2" />
        //                             Save Changes
        //                         </Button>
        //                     ) : (
        //                         <Button
        //                             onClick={() => setIsEditing(true)}
        //                             className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 shadow-lg shadow-blue-500/30"
        //                         >
        //                             Edit
        //                         </Button>
        //                     )} */}
        //                     <Link href={`/ticket/${ticket.id}/edit`}>
        //                         <Button
        //                             className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 shadow-lg shadow-blue-500/30"
        //                         >
        //                             <Pencil className="size-4 md:mr-2" />
        //                             <span className="hidden md:block">Edit</span>
        //                         </Button>
        //                     </Link>
        //                 </div>
        //             </div>
        //         </div>
        //     </header>

        //     <main className="max-w-6xl mx-auto px-6 py-8">
        //         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        //             {/* Main Content */}
        //             <div className="lg:col-span-2 space-y-4">
        //                 {/* Status Card */}
        //                 <Card className={`p-6 ${alertBorders[alertLevel]}`}>
        //                     <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        //                         <h2 className="text-lg font-semibold">
        //                             Status
        //                         </h2>
        //                         {alertLevel !== "normal" && (
        //                             <Badge
        //                                 variant={
        //                                     alertLevel === "warning"
        //                                         ? "outline"
        //                                         : "destructive"
        //                                 }
        //                             >
        //                                 {alertLevel === "warning"
        //                                     ? "Due Soon"
        //                                     : "Overdue"}
        //                             </Badge>
        //                         )}
        //                     </div>

        //                     <div className="space-y-4">
        //                         <div>
        //                             <Label>Current Status</Label>
        //                             {/* <Select
        //                                 value={ticket.status}
        //                                 onValueChange={(value) =>
        //                                     handleStatusChange(
        //                                         value as TicketStatus,
        //                                     )
        //                                 }
        //                                 disabled={!isEditing}
        //                             >
        //                                 <SelectTrigger>
        //                                     <SelectValue />
        //                                 </SelectTrigger>
        //                                 <SelectContent>
        //                                     <SelectItem value="queued">
        //                                         Queued
        //                                     </SelectItem>
        //                                     <SelectItem value="diagnosing">
        //                                         Diagnosing
        //                                     </SelectItem>
        //                                     <SelectItem value="waiting-parts">
        //                                         Waiting for Parts
        //                                     </SelectItem>
        //                                     <SelectItem value="repairing">
        //                                         Repairing
        //                                     </SelectItem>
        //                                     <SelectItem value="ready">
        //                                         Ready for Pickup
        //                                     </SelectItem>
        //                                     <SelectItem value="completed">
        //                                         Completed
        //                                     </SelectItem>
        //                                 </SelectContent>
        //                             </Select> */}
        //                             <span className="text-sm text-slate-600 font-medium">
        //                                 {getStatusFromSlug(ticket.status as TicketStatus)}
        //                             </span>
        //                         </div>

        //                         <div>
        //                             <Label>Estimated Completion</Label>
        //                             <div className="flex items-center justify-between gap-3">
        //                                 {/* <Input
        //                                     type="datetime-local"
        //                                     value={ticket.etr ? new Date(
        //                                         ticket.etr
        //                                     ) : undefined
        //                                     }
        //                                     onChange={(e) =>
        //                                         setTicket({
        //                                             ...ticket,
        //                                             estimatedCompletionDate:
        //                                                 new Date(
        //                                                     e.target.value,
        //                                                 ),
        //                                         })
        //                                     }
        //                                     disabled={!isEditing}
        //                                 /> */}
        //                                 <span className="text-sm text-slate-600">
        //                                     {ticket.etr ? new Date(
        //                                         ticket.etr
        //                                     ).toLocaleString() : "- -"}
        //                                 </span>
        //                                 <Badge
        //                                     variant={
        //                                         alertLevel === "danger"
        //                                             ? "destructive"
        //                                             : alertLevel === "warning"
        //                                                 ? "outline"
        //                                                 : "secondary"
        //                                     }
        //                                 >
        //                                     {getTimeUntilDeadline(
        //                                         ticket.etr
        //                                     )}
        //                                 </Badge>
        //                             </div>
        //                         </div>
        //                     </div>
        //                 </Card>

        //                 {/* Device Information */}
        //                 <Card className="p-6">
        //                     <h2 className="text-lg font-semibold pb-4 border-b border-slate-200">
        //                         Device Information
        //                     </h2>
        //                     <div className="grid grid-cols-2 gap-4">
        //                         <div>
        //                             <Label className="text-gray-600">
        //                                 Device Type
        //                             </Label>
        //                             <p className="font-medium">
        //                                 {ticket.device_type}
        //                             </p>
        //                         </div>
        //                         <div>
        //                             <Label className="text-gray-600">
        //                                 Brand
        //                             </Label>
        //                             <p className="font-medium">
        //                                 {ticket.device_brand}
        //                             </p>
        //                         </div>
        //                         <div className="col-span-2">
        //                             <Label className="text-gray-600">
        //                                 Model
        //                             </Label>
        //                             <p className="font-medium">
        //                                 {ticket.device_model}
        //                             </p>
        //                         </div>
        //                     </div>
        //                 </Card>

        //                 {/* Issue Description */}
        //                 <Card className="p-6">
        //                     <h2 className="text-lg font-semibold pb-4 border-b border-slate-200">
        //                         Issue Description
        //                     </h2>
        //                     <p className="text-gray-700">
        //                         {ticket.issue_description}
        //                     </p>
        //                 </Card>

        //                 {/* Technician Notes */}
        //                 <Card className="p-6">
        //                     <h2 className="text-lg font-semibold pb-4 border-b border-slate-200">
        //                         Technician Notes
        //                     </h2>
        //                     <Textarea
        //                         value={ticket.technician_notes}
        //                         // onChange={(e) =>
        //                         //     setTicket({
        //                         //         ...ticket,
        //                         //         notes: e.target.value,
        //                         //     })
        //                         // }
        //                         placeholder="Add notes about the repair process..."
        //                         rows={4}
        //                         disabled={true}
        //                     />
        //                     {/* <span className="text-sm text-slate-600">
        //                         {ticket.technician_notes}
        //                     </span> */}
        //                 </Card>

        //                 {/* Photos */}
        //                 <Card className="p-6">
        //                     <h2 className="text-lg font-semibold pb-4 border-b border-slate-200">
        //                         Photos
        //                     </h2>
        //                     <div className="space-y-4">
        //                         <div>
        //                             {/* <h3 className="text-sm font-medium mb-2">
        //                                 Before
        //                             </h3> */}
        //                             {ticket.photo && ticket.photo.length > 0 ? (
        //                                 <div className="grid grid-cols-3 gap-3">
        //                                     {/* {ticket.photo.map(
        //                                         (photo, index) => (
        //                                             <img
        //                                                 key={index}
        //                                                 src={photo}
        //                                                 alt={`Before ${index + 1}`}
        //                                                 className="rounded-lg w-full h-32 object-cover"
        //                                             />
        //                                         ),
        //                                     )} */}
        //                                     <ImageModal src={ticket.photo} alt="Device Photo" />
        //                                 </div>
        //                             ) : (
        //                                 <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        //                                     <Camera className="size-8 mx-auto text-gray-400 mb-2" />
        //                                     <p className="text-sm text-gray-500">
        //                                         No photos uploaded
        //                                     </p>
        //                                 </div>
        //                             )}
        //                         </div>

        //                         {/* {isEditing && (
        //                             <div>
        //                                 <h3 className="text-sm font-medium mb-2">
        //                                     After (Optional)
        //                                 </h3>
        //                                 <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400">
        //                                     <Camera className="size-8 mx-auto text-gray-400 mb-2" />
        //                                     <p className="text-sm text-gray-500">
        //                                         Upload after-repair photos
        //                                     </p>
        //                                 </div>
        //                             </div>
        //                         )} */}
        //                     </div>
        //                 </Card>
        //             </div>

        //             {/* Sidebar */}
        //             <div className="space-y-6">
        //                 {/* Customer Info */}
        //                 <Card className="p-6">
        //                     <h2 className="text-lg font-semibold pb-4 border-b border-slate-200">
        //                         Customer
        //                     </h2>
        //                     <div className="space-y-3">
        //                         <div>
        //                             <Label className="text-gray-600">
        //                                 Name
        //                             </Label>
        //                             <p className="font-medium">
        //                                 {ticket.customer_name}
        //                             </p>
        //                         </div>
        //                         <div>
        //                             <Label className="text-gray-600">
        //                                 Phone
        //                             </Label>
        //                             <div className="flex items-center gap-2">
        //                                 <Phone className="size-4 text-gray-400" />
        //                                 <p className="font-medium">
        //                                     {ticket.customer_phone}
        //                                 </p>
        //                             </div>
        //                         </div>
        //                         {ticket.customer_email && (
        //                             <div>
        //                                 <Label className="text-gray-600">
        //                                     Email
        //                                 </Label>
        //                                 <div className="flex items-center gap-2">
        //                                     <Mail className="size-4 text-gray-400" />
        //                                     <p className="font-medium text-sm">
        //                                         {ticket.customer_email}
        //                                     </p>
        //                                 </div>
        //                             </div>
        //                         )}
        //                         <Button
        //                             variant="outline"
        //                             className="w-full mt-4"
        //                             onClick={() => window.location.href = `tel:${ticket.customer_phone}`}
        //                         >
        //                             <Phone className="size-4 mr-2" />
        //                             Call Customer
        //                         </Button>
        //                     </div>
        //                 </Card>

        //                 {/* Tracking */}
        //                 <Card className="p-6">
        //                     <h2 className="text-lg font-semibold pb-4 border-b border-slate-200">
        //                         Tracking
        //                     </h2>
        //                     <div className="space-y-3">
        //                         <div>
        //                             <Label className="text-gray-600">
        //                                 Tracking ID
        //                             </Label>
        //                             <p className="font-mono text-sm">
        //                                 {ticket.ticket_number}
        //                             </p>
        //                         </div>
        //                         <Link
        //                             href={`/customer/${ticket.ticket_number}`}
        //                             target="_blank"
        //                         >
        //                             <Button
        //                                 variant="outline"
        //                                 className="w-full"
        //                             >
        //                                 View Customer Portal
        //                             </Button>
        //                         </Link>
        //                     </div>
        //                 </Card>

        //                 {/* Payment */}
        //                 <Card className="p-6">
        //                     <h2 className="text-lg font-semibold pb-4 border-b border-slate-200">
        //                         Payment
        //                     </h2>
        //                     <div className="space-y-3">
        //                         <div>
        //                             <Label>Repair Cost</Label>
        //                             <div className="flex items-center gap-2">
        //                                 <PhilippinePeso className="size-4 text-gray-400" />
        //                                 {/* <Input
        //                                     type="number"
        //                                     value={ticket.cost}
        //                                     onChange={(e) =>
        //                                         setTicket({
        //                                             ...ticket,
        //                                             cost:
        //                                                 parseFloat(
        //                                                     e.target.value,
        //                                                 ) || 0,
        //                                         })
        //                                     }
        //                                     disabled={!isEditing}
        //                                     min="0"
        //                                     step="0.01"
        //                                 /> */}
        //                             </div>
        //                         </div>
        //                         <Badge
        //                             variant={
        //                                 ticket.payment.paid ? "default" : "secondary"
        //                             }
        //                             className="w-full justify-center"
        //                         >
        //                             {ticket.payment.paid ? "Paid" : "Unpaid"}
        //                         </Badge>
        //                     </div>
        //                 </Card>

        //                 {/* Timeline */}
        //                 <Card className="p-6">
        //                     <h2 className="text-lg font-semibold pb-4 border-b border-slate-200">
        //                         Timeline
        //                     </h2>
        //                     <div className="space-y-3 text-sm">
        //                         <div>
        //                             <Label className="text-gray-600">
        //                                 Created
        //                             </Label>
        //                             <p>
        //                                 {new Date(
        //                                     ticket.timeline.created_at,
        //                                 ).toLocaleString()}
        //                             </p>
        //                         </div>
        //                         <div>
        //                             <Label className="text-gray-600">
        //                                 Last Updated
        //                             </Label>
        //                             <p>
        //                                 {new Date(
        //                                     ticket.timeline.updated_at,
        //                                 ).toLocaleString()}
        //                             </p>
        //                         </div>
        //                     </div>
        //                 </Card>
        //             </div>
        //         </div>
        //     </main>
        // </div>

    // );
}
