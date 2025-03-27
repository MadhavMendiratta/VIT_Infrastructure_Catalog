"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Building, MapPin, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { buildings } from "@/lib/buildings"

export default function NavigationPage() {
  const [selectedBuilding, setSelectedBuilding] = useState("")
  const [selectedFloor, setSelectedFloor] = useState("")
  const [selectedRoom, setSelectedRoom] = useState("")
  const [showMap, setShowMap] = useState(false)

  // Get the current building data
  const currentBuilding = buildings.find((b) => b.id === selectedBuilding)

  // Get floors for the selected building
  const floors = currentBuilding
    ? Array.from({ length: currentBuilding.floors }, (_, i) => (i === 0 ? "Ground Floor" : `Floor ${i}`))
    : []

  // Get rooms for the selected floor
  const rooms =
    currentBuilding?.rooms.filter((room) => {
      const floorIndex = floors.indexOf(selectedFloor)
      if (floorIndex === 0) {
        return room.roomNo.startsWith("G")
      } else if (floorIndex > 0) {
        return room.roomNo.startsWith(floorIndex.toString())
      }
      return false
    }) || []

  const getDetailedDirections = (buildingId: string, floor: string, roomNo: string) => {
    // Get the current building data
    const building = buildings.find((b) => b.id === buildingId)
    if (!building) return <p>Building not found.</p>

    // Get the selected room
    const room = building.rooms.find((r) => r.roomNo === roomNo)
    if (!room) return <p>Room not found.</p>

    // Find nearby facilities for reference
    const nearbyFacilities = building.rooms
      .filter((r) => {
        // Rooms on the same floor
        if (floor === "Ground Floor" && r.roomNo.startsWith("G")) {
          // Get rooms with similar numbers (e.g., G01 is near G02)
          const currentNum = Number.parseInt(roomNo.replace(/\D/g, ""))
          const otherNum = Number.parseInt(r.roomNo.replace(/\D/g, ""))
          return Math.abs(currentNum - otherNum) <= 2 && r.roomNo !== roomNo
        } else if (floor !== "Ground Floor") {
          const floorNum = floor.split(" ")[1]
          if (r.roomNo.startsWith(floorNum)) {
            const currentNum = Number.parseInt(roomNo.replace(/\D/g, ""))
            const otherNum = Number.parseInt(r.roomNo.replace(/\D/g, ""))
            return Math.abs(currentNum - otherNum) <= 2 && r.roomNo !== roomNo
          }
        }
        return false
      })
      .filter(
        (r) =>
          r.roomName.toLowerCase().includes("lab") ||
          r.roomName.toLowerCase().includes("toilet") ||
          r.roomName.toLowerCase().includes("washroom") ||
          r.roomName.toLowerCase().includes("class"),
      )
      .slice(0, 2) // Get up to 2 nearby facilities

    // Generate basic directions
    return (
      <>
        <p>1. Enter the {building.name} building from the main entrance.</p>
        {floor === "Ground Floor" ? (
          <p>2. You are already on the Ground Floor.</p>
        ) : (
          <p>2. Take the stairs or elevator to reach {floor}.</p>
        )}
        <p>
          3. Look for Room {roomNo} ({room.roomName}).
        </p>
        {nearbyFacilities.length > 0 && (
          <p>4. The room is located near {nearbyFacilities.map((r) => `${r.roomName} (${r.roomNo})`).join(" and ")}.</p>
        )}
        <p>5. The room belongs to the {room.department} department.</p>
      </>
    )
  }

  const handleNavigate = () => {
    setShowMap(true)
  }

  return (
    <div className="container px-4 md:px-6 py-12">
      <div className="mb-8">
        <Link href="/" className="text-primary hover:underline inline-flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-gray-900 p-6 rounded-lg">
            <h1 className="text-2xl font-bold mb-6">Campus Navigation</h1>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Select Building</label>
                <Select
                  value={selectedBuilding}
                  onValueChange={(value) => {
                    setSelectedBuilding(value)
                    setSelectedFloor("")
                    setSelectedRoom("")
                    setShowMap(false)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a building" />
                  </SelectTrigger>
                  <SelectContent>
                    {buildings.map((building) => (
                      <SelectItem key={building.id} value={building.id}>
                        {building.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedBuilding && (
                <div>
                  <label className="block text-sm font-medium mb-2">Select Floor</label>
                  <Select
                    value={selectedFloor}
                    onValueChange={(value) => {
                      setSelectedFloor(value)
                      setSelectedRoom("")
                      setShowMap(false)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a floor" />
                    </SelectTrigger>
                    <SelectContent>
                      {floors.map((floor, index) => (
                        <SelectItem key={index} value={floor}>
                          {floor}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedFloor && (
                <div>
                  <label className="block text-sm font-medium mb-2">Select Room</label>
                  <Select
                    value={selectedRoom}
                    onValueChange={(value) => {
                      setSelectedRoom(value)
                      setShowMap(false)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a room" />
                    </SelectTrigger>
                    <SelectContent>
                      {rooms.map((room, index) => (
                        <SelectItem key={index} value={room.roomNo}>
                          {room.roomNo} - {room.roomName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedRoom && (
                <Button className="w-full" onClick={handleNavigate}>
                  <Navigation className="mr-2 h-4 w-4" /> Navigate
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {!showMap ? (
            <div className="bg-gray-900 p-6 rounded-lg h-full flex items-center justify-center">
              <div className="text-center">
                <Building className="h-16 w-16 mx-auto text-gray-600 mb-4" />
                <h2 className="text-xl font-medium mb-2">Select a destination</h2>
                <p className="text-gray-400">Choose a building, floor, and room to navigate to</p>
              </div>
            </div>
          ) : (
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <div className="p-4 bg-gray-800 flex items-center justify-between">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-primary mr-2" />
                  <span>
                    {currentBuilding?.name} &gt; {selectedFloor} &gt; Room {selectedRoom}
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowMap(false)}>
                  Reset
                </Button>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">External Navigation</h3>
                  <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-gray-400 mb-2">Google Maps Integration</p>
                      <p className="text-xs text-gray-500">
                        (External navigation will be integrated with Google Maps API)
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Internal Navigation</h3>
                  <div className="aspect-video bg-gray-800 rounded-lg p-4">
                    <div className="h-full flex flex-col">
                      <div className="text-center mb-4">
                        <h4 className="font-medium">Directions to Room {selectedRoom}</h4>
                        <p className="text-sm text-gray-400">
                          {currentBuilding?.name} &gt; {selectedFloor}
                        </p>
                      </div>
                      <div className="flex-1 overflow-y-auto">
                        {selectedBuilding && selectedFloor && selectedRoom && (
                          <div className="text-gray-300 space-y-2">
                            {getDetailedDirections(selectedBuilding, selectedFloor, selectedRoom)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

