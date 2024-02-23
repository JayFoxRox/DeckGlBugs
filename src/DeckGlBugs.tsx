// `<React.StrictMode>` triggers some race condition ("Cannot read properties of null (reading 'attachTimeline')")
// (workaround is used if disabled)
const enableBug1 = true

// By default the deck.gl canvas displays in the wrong location
// (workaround is used if disabled)
const enableBug2 = true

// Updating the layer each frame leads to double-rendering while zooming / moving = increased opacity and flickering
// (workaround is used if disabled)
const enableBug3 = true

// maplibre Popups show below the deck.gl features
// (no workaround is shown here, so this just disables the bug)
const enableBug4 = true


import { MapboxOverlay } from "@deck.gl/mapbox"
import { useEffect, useRef } from "react"
import maplibre, { Popup } from 'maplibre-gl'
import { assert } from "./assert"
import { ScatterplotLayer } from "deck.gl"
import React from "react"


export function DeckGlBugs() {

    function Child() {
        const containerRef = useRef<HTMLDivElement | null>(null)
        const overlayRef = useRef<MapboxOverlay | null>(null)

        useEffect(() => {
            assert(containerRef.current !== null)

            const map = new maplibre.Map({
                container: containerRef.current,
                center: [-122.4, 37.74],
                zoom: 11,
                antialias: true, // Improves the rendering quality
                style: 'https://demotiles.maplibre.org/style.json'
            })

            const mapboxOverlay = new MapboxOverlay({

                style: enableBug2 ? undefined : {
                    left: '0',
                    top: '0',
                },

                interleaved: false,
            })

            const layerUpdateEachFrame = () => {
                mapboxOverlay.setProps({
                    layers: [
                        new ScatterplotLayer({
                            id: 'ScatterplotLayer',
                            data: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart-stations.json',
                            getFillColor: [255, 140, 0],
                            getPosition: d => d.coordinates,
                            getRadius: d => Math.sqrt(d.exits),
                            radiusMaxPixels: 500,
                            radiusMinPixels: 1,
                            radiusScale: 40,
                            opacity: 0.01,
                        })
                    ]
                })

                if (enableBug3) {
                    requestAnimationFrame(layerUpdateEachFrame)
                }
            }
            layerUpdateEachFrame()

            // @ts-expect-error expects maplibre IControl but gets mapbox IControl
            map.addControl(mapboxOverlay)

            overlayRef.current = mapboxOverlay

            let popup: Popup | null = null
            if (enableBug4) {
                popup = new Popup({
                    closeOnClick: false,
                    closeButton: false
                })
                    .setText("Bug ".repeat(8).trim())
                    .setLngLat(map.getCenter())
                    .addTo(map)
            }

            return () => {

                if (popup !== null) {
                    popup.remove()
                }

                map.remove()

                assert(overlayRef.current !== null)
                overlayRef.current.finalize()
                overlayRef.current = null
            }
        }, [])


        return <div ref={containerRef} style={{ width: '500px', height: '500px', border: '3px green solid' }}></div>

    }

    const RootElement = enableBug1 ? React.StrictMode : React.Fragment

    return <RootElement>
        <ul>
            <li>Bug 1: {String(enableBug1)}</li>
            <li>Bug 2: {String(enableBug2)}</li>
            <li>Bug 3: {String(enableBug3)}</li>
            <li>Bug 4: {String(enableBug4)}</li>
        </ul>
        <Child />
    </RootElement>
}