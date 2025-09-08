import { useState, useRef, useEffect } from 'react'
import ChannelBadge from './ChannelBadge'
import ChannelMenu from './ChannelMenu'
import PreviewCarousel from './PreviewCarousel'

const PostBuilderModal = ({ onClose }) => {
  const [showPreview, setShowPreview] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [selectedChannels, setSelectedChannels] = useState([])
  const [showChannelMenu, setShowChannelMenu] = useState(false)
  const [caption, setCaption] = useState('')
  const [media, setMedia] = useState([])
  const modalRef = useRef(null)
  const addButtonRef = useRef(null)
  
  const modalWidth = showPreview ? 1120 : 720
  const modalHeight = 550
  
  // Center the modal on initial load
  const [position, setPosition] = useState(() => ({
    x: (window.innerWidth - modalWidth) / 2,
    y: (window.innerHeight - modalHeight) / 2
  }))

  // Update position when preview toggle changes modal width
  useEffect(() => {
    setPosition(prev => ({
      ...prev,
      x: (window.innerWidth - modalWidth) / 2
    }))
  }, [modalWidth])

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const handleMouseDown = (e) => {
    if (e.target.closest('.drag-handle')) {
      setIsDragging(true)
      const rect = modalRef.current.getBoundingClientRect()
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })
    }
  }

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Properly manage drag event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, dragOffset])

  // Channel management functions
  const handleChannelToggle = (channelId, postType) => {
    setSelectedChannels(prev => {
      const existingIndex = prev.findIndex(channel => channel.id === channelId)
      
      if (existingIndex >= 0) {
        // Remove channel
        return prev.filter((_, index) => index !== existingIndex)
      } else {
        // Add channel
        return [...prev, { id: channelId, postType }]
      }
    })
  }

  const handlePostTypeSelect = (channelId, postType) => {
    setSelectedChannels(prev => {
      const existingIndex = prev.findIndex(channel => channel.id === channelId)
      
      if (existingIndex >= 0) {
        // Update existing channel
        const updated = [...prev]
        updated[existingIndex] = { id: channelId, postType }
        return updated
      } else {
        // Add new channel with post type
        return [...prev, { id: channelId, postType }]
      }
    })
  }

  const handleChannelRemove = (channelId) => {
    setSelectedChannels(prev => prev.filter(channel => channel.id !== channelId))
  }

  const handleChannelEdit = (channelId) => {
    // TODO: Implement individual channel editing
    console.log('Edit channel:', channelId)
  }

  const handleMediaUpload = () => {
    // Simulate media upload with dummy data
    setMedia([
      { id: 1, type: 'image', url: 'placeholder-image.jpg', name: 'Sample Image' }
    ])
  }

  const handleCaptionChange = (e) => {
    setCaption(e.target.value)
  }

  return (
    <>
      {/* Overlay */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 999
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose()
          }
        }}
      />
      
      {/* Modal */}
      <div
        ref={modalRef}
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          width: modalWidth,
          height: modalHeight,
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '16px 20px',
          borderBottom: '1px solid #e1e5e9',
          backgroundColor: '#f8f9fa'
        }}>
          {/* Drag Handle */}
          <div className="drag-handle" style={{
            cursor: isDragging ? 'grabbing' : 'grab',
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gridTemplateRows: 'repeat(3, 1fr)',
            gap: '2px',
            width: '12px',
            height: '12px',
            marginRight: '12px'
          }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{
                width: '4px',
                height: '4px',
                backgroundColor: '#6c757d',
                borderRadius: '50%'
              }} />
            ))}
          </div>

          {/* Title */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flex: 1
          }}>
            <span style={{ fontWeight: '600', fontSize: '16px' }}>New Post</span>
            <button style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px'
            }}>
              ✏️
            </button>
          </div>

          {/* Right Side Controls */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <button 
              onClick={() => setShowPreview(!showPreview)}
              style={{
                padding: '8px 12px',
                backgroundColor: showPreview ? '#e9ecef' : '#007bff',
                color: showPreview ? '#495057' : 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              {showPreview ? 'Hide Post Preview' : 'Show Post Preview'}
            </button>
            
            <button 
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '18px',
                padding: '4px 8px',
                borderRadius: '4px'
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{
          display: 'flex',
          flex: 1,
          overflow: 'hidden'
        }}>
          {/* Left Panel */}
          <div style={{
            width: showPreview ? '60%' : '100%',
            padding: '20px',
            borderRight: showPreview ? '1px solid #e1e5e9' : 'none',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
          }}>
            {/* Media Uploader + Caption Editor */}
            <div style={{
              display: 'flex',
              gap: '16px',
              marginBottom: '20px'
            }}>
              {/* Media Uploader */}
              <div 
                onClick={handleMediaUpload}
                style={{
                  flex: 1,
                  border: '2px dashed #dee2e6',
                  borderRadius: '8px',
                  padding: '40px 20px',
                  textAlign: 'center',
                  backgroundColor: '#f8f9fa',
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>
                  {media.length > 0 ? '📷' : '📁'}
                </div>
                <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                  {media.length > 0 ? `${media.length} file(s) selected` : 'Upload Media'}
                </div>
                <div style={{ fontSize: '14px', color: '#6c757d' }}>
                  {media.length > 0 ? 'Click to change files' : 'Drag & drop or click to upload'}
                </div>
              </div>

              {/* Caption Editor */}
              <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column'
              }}>
                <textarea 
                  placeholder="Write your caption..."
                  value={caption}
                  onChange={handleCaptionChange}
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: '1px solid #dee2e6',
                    borderRadius: '8px',
                    resize: 'none',
                    fontFamily: 'inherit',
                    fontSize: '14px',
                    minHeight: '120px'
                  }}
                />
              </div>
            </div>

            {/* Social Channel Selector */}
            <div style={{
              marginBottom: '20px',
              position: 'relative'
            }}>
              {selectedChannels.length === 0 ? (
                // Empty State
                <div style={{
                  border: '1px solid #dee2e6',
                  borderRadius: '8px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span style={{
                    color: '#6c757d',
                    fontSize: '14px'
                  }}>
                    Click the "+" to add your channels.
                  </span>
                  
                  <button 
                    ref={addButtonRef}
                    onClick={() => setShowChannelMenu(!showChannelMenu)}
                    style={{
                      height: '40px',
                      width: '40px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    +
                  </button>
                </div>
              ) : (
                // Selected Channels State
                <div style={{
                  border: '1px solid #dee2e6',
                  borderRadius: '8px',
                  padding: '12px'
                }}>
                  {/* Channel Badges */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    marginBottom: '12px'
                  }}>
                    {selectedChannels.map(channel => (
                      <ChannelBadge
                        key={channel.id}
                        channelId={channel.id}
                        postType={channel.postType}
                        onEdit={handleChannelEdit}
                        onRemove={handleChannelRemove}
                      />
                    ))}
                  </div>
                  
                  {/* Controls */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0',
                    justifyContent: 'flex-end'
                  }}>
                    <button style={{
                      height: '36px',
                      padding: '8px 16px',
                      backgroundColor: '#f8f9fa',
                      color: '#495057',
                      border: '1px solid #dee2e6',
                      borderRadius: '6px 0 0 6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      borderRight: 'none'
                    }}>
                      Customize
                    </button>
                    
                    <button 
                      ref={addButtonRef}
                      onClick={() => setShowChannelMenu(!showChannelMenu)}
                      style={{
                        height: '36px',
                        width: '36px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0 6px 6px 0',
                        cursor: 'pointer',
                        fontSize: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Channel Selection Menu */}
              {showChannelMenu && (
                <ChannelMenu
                  selectedChannels={selectedChannels}
                  onChannelToggle={handleChannelToggle}
                  onPostTypeSelect={handlePostTypeSelect}
                  onClose={() => setShowChannelMenu(false)}
                  buttonRef={addButtonRef}
                />
              )}
            </div>

            {/* Sticky Footer */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 0',
              borderTop: '1px solid #e1e5e9',
              marginTop: 'auto'
            }}>
              <button style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '18px',
                color: '#dc3545'
              }}>
                🗑️
              </button>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <button style={{
                  padding: '8px 12px',
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #dee2e6',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}>
                  📅 Select Date
                </button>

                <button style={{
                  padding: '10px 20px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}>
                  Save Post
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel - Preview Carousel */}
          {showPreview && (
            <div style={{
              width: '40%',
              backgroundColor: '#f8f9fa'
            }}>
              <PreviewCarousel
                selectedChannels={selectedChannels}
                caption={caption}
                media={media}
              />
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default PostBuilderModal