import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getBuildingData } from "@/lib/buildings"

export default function BuildingFacilitiesPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { highlight?: string }
}) {
  const buildingId = params.id
  const highlightedRoom = searchParams.highlight
  const building = getBuildingData(buildingId)

  if (!building) {
    return (
      <div className="container px-4 md:px-6 py-12 text-center">
        <h1 className="text-4xl font-bold mb-8">Building Not Found</h1>
        <p className="mb-8">The building you are looking for does not exist.</p>
        <Link href="/buildings">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Buildings
          </Button>
        </Link>
      </div>
    )
  }

  // Group rooms by type (labs, conference rooms, etc.)
  const facilitiesByType: Record<string, any[]> = {}

  building.rooms.forEach((room) => {
    const roomName = room.roomName.toLowerCase()
    let type = "Other"

    if (roomName.includes("lab")) type = "Labs"
    else if (roomName.includes("conference")) type = "Conference Rooms"
    else if (roomName.includes("class")) type = "Classrooms"
    else if (roomName.includes("auditorium")) type = "Auditoriums"

    if (!facilitiesByType[type]) facilitiesByType[type] = []
    facilitiesByType[type].push(room)
  })

  return (
    <div className="container px-4 md:px-6 py-12">
      <div className="mb-8">
        <Link href={`/buildings/${buildingId}`} className="text-primary hover:underline inline-flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to {building.name}
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8">{building.name} Facilities</h1>

      {highlightedRoom && (
        <div className="mb-8 p-4 bg-primary/20 border border-primary/30 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Highlighted Facility</h2>
          {building.rooms
            .filter((room) => room.roomNo === highlightedRoom)
            .map((room, index) => (
              <div key={index} className="bg-gray-900 rounded-lg overflow-hidden animate-pulse">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-primary">{room.roomName}</h3>
                  <p className="text-gray-400 mb-2">Room: {room.roomNo}</p>
                  <p className="text-gray-400 mb-2">Area: {room.area}</p>
                  <p className="text-gray-400">Department: {room.department}</p>
                </div>
              </div>
            ))}
        </div>
      )}

      {Object.entries(facilitiesByType).map(([type, facilities]) => (
        <div key={type} className="mb-12">
          <h2 className="text-2xl font-bold mb-6">{type}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((facility, index) => (
              <div
                key={index}
                className={`bg-gray-900 rounded-lg overflow-hidden ${facility.roomNo === highlightedRoom ? "ring-2 ring-primary" : ""}`}
                id={facility.roomNo === highlightedRoom ? "highlighted-facility" : ""}
              >
                <div className="h-48 bg-gray-800 relative">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url('/placeholder.svg?height=400&width=600&text=${facility.roomName}')`,
                    }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{facility.roomName}</h3>
                  <p className="text-gray-400 mb-2">Room: {facility.roomNo}</p>
                  <p className="text-gray-400 mb-2">Area: {facility.area} sqft</p>
                  <p className="text-gray-400">Department: {facility.department}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

