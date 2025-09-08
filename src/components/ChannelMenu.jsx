import { useState, useRef, useEffect } from 'react'
import { platforms } from '../data/platforms'

const ChannelMenu = ({ selectedChannels, onChannelToggle, onPostTypeSelect, onClose }) => {
  const [activeSubmenu, setActiveSubmenu] = useState(null)
  const menuRef = useRef(null)
  const submenuRef = useRef(null)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  const isChannelSelected = (platformId) => {
    return selectedChannels.some(channel => channel.id === platformId)
  }

  const getSelectedPostType = (platformId) => {
    const channel = selectedChannels.find(channel => channel.id === platformId)
    return channel?.postType || null
  }

  const handleChannelClick = (platform) => {
    if (platform.types && platform.types.length > 0) {
      // Multi-type platform - open submenu
      setActiveSubmenu(activeSubmenu === platform.id ? null : platform.id)
    } else {
      // Single-type platform - toggle directly
      onChannelToggle(platform.id, null)
      setActiveSubmenu(null)
    }
  }

  const handlePostTypeSelect = (platformId, postType) => {
    onPostTypeSelect(platformId, postType)
    // Keep submenu open as specified
  }

  const renderPlatformItem = (platform, isConnected) => {
    const selected = isChannelSelected(platform.id)
    const selectedType = getSelectedPostType(platform.id)
    const hasTypes = platform.types && platform.types.length > 0
    const showSubmenu = activeSubmenu === platform.id

    return (
      <div key={platform.id} style={{ position: 'relative' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px 16px',
            cursor: 'pointer',
            backgroundColor: showSubmenu ? '#f8f9fa' : 'transparent',
            borderRadius: '4px'
          }}
          onClick={() => handleChannelClick(platform)}
        >
          <input
            type="checkbox"
            checked={selected}
            onChange={() => {}}
            style={{
              marginRight: '12px',
              cursor: 'pointer'
            }}
            onClick={(e) => {
              e.stopPropagation()
              if (!hasTypes) {
                onChannelToggle(platform.id, null)
              }
            }}
          />
          
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            backgroundColor: platform.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '12px',
            fontSize: '16px'
          }}>
            {platform.icon}
          </div>
          
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: '500', fontSize: '14px' }}>
              {platform.name}
            </div>
            {isConnected && (
              <div style={{ fontSize: '12px', color: '#6c757d' }}>
                {platform.account}
              </div>
            )}
            {selected && selectedType && (
              <div style={{ fontSize: '12px', color: '#6c757d' }}>
                {selectedType}
              </div>
            )}
          </div>
          
          {hasTypes && (
            <div style={{ 
              fontSize: '12px', 
              color: '#6c757d',
              transform: showSubmenu ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s'
            }}>
              ›
            </div>
          )}
        </div>

        {/* Submenu */}
        {showSubmenu && hasTypes && (
          <div
            ref={submenuRef}
            style={{
              position: 'absolute',
              left: '100%',
              top: '0',
              width: '160px',
              backgroundColor: 'white',
              border: '1px solid #e1e5e9',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              zIndex: 1001,
              padding: '8px'
            }}
          >
            <div style={{
              fontSize: '12px',
              color: '#6c757d',
              padding: '8px 12px',
              fontWeight: '500'
            }}>
              Post Type
            </div>
            
            {platform.types.map(type => (
              <label
                key={type}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 12px',
                  cursor: 'pointer',
                  borderRadius: '4px'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                <input
                  type="radio"
                  name={`${platform.id}-type`}
                  checked={selectedType === type}
                  onChange={() => handlePostTypeSelect(platform.id, type)}
                  style={{ marginRight: '8px' }}
                />
                <span style={{ fontSize: '14px' }}>{type}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      ref={menuRef}
      style={{
        position: 'absolute',
        top: '-8px',
        right: '0',
        width: '280px',
        maxHeight: '400px',
        backgroundColor: 'white',
        border: '1px solid #e1e5e9',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
        overflow: 'auto',
        transform: 'translateY(-100%)'
      }}
    >
      {/* Connected Channels Section */}
      <div style={{ padding: '16px' }}>
        <div style={{
          fontSize: '12px',
          color: '#6c757d',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          marginBottom: '12px'
        }}>
          My linked channels
        </div>
        
        {platforms.connected.map(platform => 
          renderPlatformItem(platform, true)
        )}
      </div>

      {/* Divider */}
      <div style={{
        height: '1px',
        backgroundColor: '#e1e5e9',
        margin: '0 16px'
      }} />

      {/* Unconnected Channels Section */}
      <div style={{ padding: '16px' }}>
        <div style={{
          fontSize: '12px',
          color: '#6c757d',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          marginBottom: '12px'
        }}>
          More channels (Reminder only)
        </div>
        
        {platforms.unconnected.map(platform => 
          renderPlatformItem(platform, false)
        )}
      </div>
    </div>
  )
}

export default ChannelMenu