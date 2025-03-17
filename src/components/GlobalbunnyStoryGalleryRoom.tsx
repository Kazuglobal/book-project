'use client'

import React, { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import { X } from 'lucide-react'

// Import storybook data from the existing component
const storybooks = [
  {
    id: "protect-from-thieves",
    title: "Protect from Thieves",
    description: "An interactive children's storybook about staying safe.",
    japaneseDescription: "子供の安全を守るためのインタラクティブな絵本。",
    coverImage: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/１-DSVP0xHyBmZw7ddVbVQQOAv7U0XWD5.png",
  },
  {
    id: "adventures-of-kumataro-and-usa",
    title: "The Adventures of Kumataro and Usa",
    description: "An exciting tale of a bear and a rabbit wizard's journey through a dangerous dungeon.",
    japaneseDescription: "クマとウサギの魔法使いが危険なダンジョンを冒険する exciting な物語。",
    coverImage: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/６-9XEkuM6Ki481j47vxiKpudWXg4joFq.png",
  }
]

// Add type declarations for Three.js modules to fix TypeScript errors
declare module 'three/examples/jsm/controls/OrbitControls.js';
declare module 'three/examples/jsm/renderers/CSS2DRenderer.js';

export function GlobalbunnyStoryGalleryRoom() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeBook, setActiveBook] = useState<string | null>(null)
  const [controlsEnabled, setControlsEnabled] = useState(true)
  
  // Get the active book data
  const activeBookData = storybooks.find(book => book.id === activeBook)
  
  useEffect(() => {
    if (!containerRef.current) return
    
    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf5f5f5)
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75, 
      containerRef.current.clientWidth / containerRef.current.clientHeight, 
      0.1, 
      1000
    )
    camera.position.set(0, 1.6, 5)
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.shadowMap.enabled = true
    containerRef.current.appendChild(renderer.domElement)
    
    // CSS2D Renderer for labels
    const labelRenderer = new CSS2DRenderer()
    labelRenderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    labelRenderer.domElement.style.position = 'absolute'
    labelRenderer.domElement.style.top = '0'
    labelRenderer.domElement.style.pointerEvents = 'none'
    containerRef.current.appendChild(labelRenderer.domElement)
    
    // Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.minDistance = 3
    controls.maxDistance = 10
    controls.maxPolarAngle = Math.PI / 2
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(5, 5, 5)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 2048
    directionalLight.shadow.mapSize.height = 2048
    scene.add(directionalLight)
    
    // Function to create the room
    const createRoom = (scene: THREE.Scene) => {
      // Floor
      const floorGeometry = new THREE.PlaneGeometry(10, 10)
      const floorMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xe0e0e0,
        roughness: 0.8,
      })
      const floor = new THREE.Mesh(floorGeometry, floorMaterial)
      floor.rotation.x = -Math.PI / 2
      floor.receiveShadow = true
      scene.add(floor)
      
      // Walls
      const wallMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xf8f8f8,
        roughness: 0.5,
      })
      
      // Back wall
      const backWallGeometry = new THREE.PlaneGeometry(10, 4)
      const backWall = new THREE.Mesh(backWallGeometry, wallMaterial)
      backWall.position.set(0, 2, -5)
      backWall.receiveShadow = true
      scene.add(backWall)
      
      // Left wall
      const leftWallGeometry = new THREE.PlaneGeometry(10, 4)
      const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial)
      leftWall.position.set(-5, 2, 0)
      leftWall.rotation.y = Math.PI / 2
      leftWall.receiveShadow = true
      scene.add(leftWall)
      
      // Right wall
      const rightWallGeometry = new THREE.PlaneGeometry(10, 4)
      const rightWall = new THREE.Mesh(rightWallGeometry, wallMaterial)
      rightWall.position.set(5, 2, 0)
      rightWall.rotation.y = -Math.PI / 2
      rightWall.receiveShadow = true
      scene.add(rightWall)
      
      // Ceiling
      const ceilingGeometry = new THREE.PlaneGeometry(10, 10)
      const ceilingMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff,
        roughness: 0.8,
      })
      const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial)
      ceiling.position.set(0, 4, 0)
      ceiling.rotation.x = Math.PI / 2
      ceiling.receiveShadow = true
      scene.add(ceiling)
      
      // Add some decorative elements
      
      // Bookshelf
      const bookshelfGeometry = new THREE.BoxGeometry(3, 2, 0.5)
      const bookshelfMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 })
      const bookshelf = new THREE.Mesh(bookshelfGeometry, bookshelfMaterial)
      bookshelf.position.set(-3, 1, -4.7)
      bookshelf.castShadow = true
      bookshelf.receiveShadow = true
      scene.add(bookshelf)
      
      // Reading table
      const tableGeometry = new THREE.CylinderGeometry(1, 0.8, 0.1, 32)
      const tableMaterial = new THREE.MeshStandardMaterial({ color: 0x5D4037 })
      const table = new THREE.Mesh(tableGeometry, tableMaterial)
      table.position.set(0, 0.5, 0)
      table.castShadow = true
      table.receiveShadow = true
      scene.add(table)
      
      // Table legs
      const legGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.5, 8)
      const legMaterial = new THREE.MeshStandardMaterial({ color: 0x3E2723 })
      
      for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2
        const leg = new THREE.Mesh(legGeometry, legMaterial)
        leg.position.set(
          Math.cos(angle) * 0.7,
          0.25,
          Math.sin(angle) * 0.7
        )
        leg.castShadow = true
        leg.receiveShadow = true
        scene.add(leg)
      }
      
      // Add some plants
      const potGeometry = new THREE.CylinderGeometry(0.2, 0.15, 0.3, 16)
      const potMaterial = new THREE.MeshStandardMaterial({ color: 0xA1887F })
      
      const plantPositions = [
        { x: 4.5, y: 0.15, z: -4.5 },
        { x: -4.5, y: 0.15, z: 4.5 }
      ]
      
      plantPositions.forEach(pos => {
        const pot = new THREE.Mesh(potGeometry, potMaterial)
        pot.position.set(pos.x, pos.y, pos.z)
        pot.castShadow = true
        pot.receiveShadow = true
        scene.add(pot)
        
        // Plant leaves
        const leafGeometry = new THREE.SphereGeometry(0.25, 8, 8)
        const leafMaterial = new THREE.MeshStandardMaterial({ color: 0x4CAF50 })
        const leaf = new THREE.Mesh(leafGeometry, leafMaterial)
        leaf.position.set(pos.x, pos.y + 0.4, pos.z)
        leaf.scale.set(1, 1.5, 1)
        leaf.castShadow = true
        scene.add(leaf)
      })
      
      // Add a rug
      const rugGeometry = new THREE.CircleGeometry(2, 32)
      const rugMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xE1BEE7,
        roughness: 1,
      })
      const rug = new THREE.Mesh(rugGeometry, rugMaterial)
      rug.rotation.x = -Math.PI / 2
      rug.position.set(0, 0.01, 0)
      rug.receiveShadow = true
      scene.add(rug)
    }
    
    // Function to add books to the room
    const addBooksToRoom = (scene: THREE.Scene) => {
      // Create a texture loader
      const textureLoader = new THREE.TextureLoader()
      
      // Position the books on the wall
      const bookPositions = [
        { x: -2, y: 1.5, z: -4.9 },
        { x: 2, y: 1.5, z: -4.9 }
      ]
      
      storybooks.forEach((book, index) => {
        const position = bookPositions[index]
        
        // Load the book cover as a texture
        textureLoader.load(book.coverImage, (texture) => {
          // Create a book frame
          const frameGeometry = new THREE.BoxGeometry(2, 2.5, 0.1)
          const frameMaterial = new THREE.MeshStandardMaterial({ color: 0xD7CCC8 })
          const frame = new THREE.Mesh(frameGeometry, frameMaterial)
          frame.position.set(position.x, position.y, position.z)
          frame.castShadow = true
          frame.receiveShadow = true
          scene.add(frame)
          
          // Create the book cover
          const aspectRatio = 1 // Adjust based on actual image aspect ratio
          const coverGeometry = new THREE.PlaneGeometry(1.8, 2.3 * aspectRatio)
          const coverMaterial = new THREE.MeshBasicMaterial({ 
            map: texture,
            side: THREE.FrontSide
          })
          const cover = new THREE.Mesh(coverGeometry, coverMaterial)
          cover.position.set(position.x, position.y, position.z + 0.06)
          scene.add(cover)
          
          // Make the book interactive
          cover.userData = { id: book.id, type: 'book' }
          
          // Add a label
          const labelDiv = document.createElement('div')
          labelDiv.className = 'bg-white/80 backdrop-blur-sm p-2 rounded shadow-md text-center'
          labelDiv.style.width = '150px'
          labelDiv.style.pointerEvents = 'auto'
          labelDiv.innerHTML = `
            <div class="font-bold text-sm">${book.title}</div>
            <div class="text-xs text-gray-600">${book.japaneseDescription}</div>
          `
          
          const label = new CSS2DObject(labelDiv)
          label.position.set(0, -1.5, 0)
          cover.add(label)
        })
      })
    }
    
    // Room creation
    createRoom(scene)
    
    // Add books to the room
    addBooksToRoom(scene)
    
    // Raycaster for interaction
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()
    
    // Handle mouse click
    const handleClick = (event: MouseEvent) => {
      if (!controlsEnabled) return
      
      // Calculate mouse position in normalized device coordinates
      const rect = containerRef.current!.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      
      // Update the raycaster
      raycaster.setFromCamera(mouse, camera)
      
      // Find intersected objects
      const intersects = raycaster.intersectObjects(scene.children, true)
      
      if (intersects.length > 0) {
        const object = intersects[0].object
        
        // Check if the object is a book
        if (object.userData && object.userData.type === 'book') {
          setActiveBook(object.userData.id)
          setControlsEnabled(false)
        }
      }
    }
    
    // Add event listener
    containerRef.current.addEventListener('click', handleClick)
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      
      // Only update controls if enabled
      if (controlsEnabled) {
        controls.update()
      }
      
      renderer.render(scene, camera)
      labelRenderer.render(scene, camera)
    }
    
    animate()
    setIsLoading(false)
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
      labelRenderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    }
    
    window.addEventListener('resize', handleResize)
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      if (containerRef.current) {
        containerRef.current.removeEventListener('click', handleClick)
        containerRef.current.removeChild(renderer.domElement)
        
        // CSS2DRendererのdisposeメソッドがない場合の対応
        if (containerRef.current.contains(labelRenderer.domElement)) {
          containerRef.current.removeChild(labelRenderer.domElement)
        }
        
        // Rendererのdisposeメソッドを呼び出す
        renderer.dispose()
        
        // Geometryとマテリアルのdispose
        scene.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            if (object.geometry) {
              object.geometry.dispose()
            }
            
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach(material => material.dispose())
              } else {
                object.material.dispose()
              }
            }
          }
        })
      }
    }
  }, [controlsEnabled])
  
  // Handle closing the book view
  const handleCloseBook = () => {
    setActiveBook(null)
    setControlsEnabled(true)
  }
  
  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
          <div className="text-xl font-bold">Loading Gallery...</div>
        </div>
      )}
      
      <div 
        ref={containerRef} 
        className="w-full h-full"
        style={{ zIndex: 1 }}
      />
      
      {activeBook && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-20">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold">{activeBookData?.title}</h2>
              <button 
                onClick={handleCloseBook}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 flex flex-col md:flex-row gap-6 overflow-y-auto">
              <div className="flex-shrink-0">
                <img 
                  src={activeBookData?.coverImage} 
                  alt={activeBookData?.title} 
                  className="w-full md:w-64 h-auto rounded-lg shadow-md"
                />
              </div>
              
              <div className="flex-grow">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-700 mb-4">{activeBookData?.description}</p>
                
                <h3 className="text-lg font-semibold mb-2">説明</h3>
                <p className="text-gray-700 mb-6">{activeBookData?.japaneseDescription}</p>
                
                <div className="mt-auto">
                  <a 
                    href={`/storybook/${activeBookData?.id}`}
                    className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Read Storybook
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="absolute bottom-4 left-4 right-4 flex justify-center z-10">
        <div className="bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg">
          <p className="text-sm text-center mb-2">
            ギャラリー内を探索するには、マウスでドラッグして視点を変更してください。
          </p>
          <p className="text-xs text-center text-gray-600">
            Drag to look around • Scroll to zoom • Click on books to interact
          </p>
        </div>
      </div>
    </div>
  )
} 