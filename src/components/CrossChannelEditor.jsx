import { useState } from 'react'
import { getPlatformById } from '../data/platforms'

const CrossChannelEditor = ({ 
  selectedChannels, 
  activeTab, 
  setActiveTab, 
  tempChanges, 
  setTempChanges,
  onCancel, 
  onUpdate 
}) => {
  
  const renderMediaView = () => {
    return (
      <div style={{
        flex: 1,
        padding: '20px',
        overflow: 'auto'
      }}>
        <h3 style={{ 
          margin: '0 0 20px 0',
          fontSize: '16px',
          fontWeight: '600' 
        }}>
          Media by Channel
        </h3>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {selectedChannels.map((channel, index) => {
            const platform = getPlatformById(channel.id)
            return (
              <div key={channel.id} style={{
                display: 'flex',
                alignItems: 'center',
                padding: '16px',
                border: '1px solid #e1e5e9',
                borderRadius: '8px',
                backgroundColor: 'white'
              }}>
                {/* Platform Info */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  minWidth: '150px',
                  marginRight: '20px'
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '4px',
                    backgroundColor: platform?.color || '#ccc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '12px',
                    fontSize: '16px'
                  }}>
                    {platform?.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: '500', fontSize: '14px' }}>
                      {platform?.name}
                    </div>
                    {channel.postType && (
                      <div style={{ fontSize: '12px', color: '#6c757d' }}>
                        {channel.postType}
                      </div>
                    )}
                  </div>
                </div>

                {/* Media Content */}
                <div style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    border: '2px dashed #dee2e6',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f8f9fa',
                    cursor: 'pointer',
                    fontSize: '32px'
                  }}>
                    {tempChanges.media?.length > 0 ? '📷' : '+'}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', marginBottom: '4px' }}>
                      {tempChanges.media?.length > 0 
                        ? `${tempChanges.media.length} file(s) selected`
                        : 'No media'
                      }
                    </div>
                    <div style={{ fontSize: '12px', color: '#6c757d' }}>
                      Click to add or change media
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderCaptionView = () => {
    return (
      <div style={{
        flex: 1,
        padding: '20px',
        overflow: 'auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h3 style={{ 
            margin: '0',
            fontSize: '16px',
            fontWeight: '600' 
          }}>
            Captions by Channel
          </h3>
          
          <button style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}>
            Apply to All
          </button>
        </div>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {selectedChannels.map((channel, index) => {
            const platform = getPlatformById(channel.id)
            return (
              <div key={channel.id} style={{
                border: '1px solid #e1e5e9',
                borderRadius: '8px',
                backgroundColor: 'white',
                overflow: 'hidden'
              }}>
                {/* Channel Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 16px',
                  backgroundColor: '#f8f9fa',
                  borderBottom: '1px solid #e1e5e9'
                }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '4px',
                    backgroundColor: platform?.color || '#ccc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '8px',
                    fontSize: '12px'
                  }}>
                    {platform?.icon}
                  </div>
                  <span style={{ fontWeight: '500', fontSize: '14px' }}>
                    {platform?.name} {channel.postType && `• ${channel.postType}`}
                  </span>
                  <div style={{ 
                    marginLeft: 'auto',
                    fontSize: '12px',
                    color: '#6c757d'
                  }}>
                    {(tempChanges.caption || '').length}/280 characters
                  </div>
                </div>

                {/* Caption Input */}
                <div style={{ padding: '16px' }}>
                  <textarea
                    placeholder={`Write caption for ${platform?.name}...`}
                    value={tempChanges.caption || ''}
                    onChange={(e) => setTempChanges(prev => ({
                      ...prev,
                      caption: e.target.value
                    }))}
                    style={{
                      width: '100%',
                      minHeight: '80px',
                      padding: '12px',
                      border: '1px solid #dee2e6',
                      borderRadius: '6px',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderDateView = () => {
    return (
      <div style={{
        flex: 1,
        padding: '20px',
        overflow: 'auto'
      }}>
        <h3 style={{ 
          margin: '0 0 20px 0',
          fontSize: '16px',
          fontWeight: '600' 
        }}>
          Scheduling by Channel
        </h3>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {selectedChannels.map((channel, index) => {
            const platform = getPlatformById(channel.id)
            const isConnected = platform?.account
            
            return (
              <div key={channel.id} style={{
                display: 'flex',
                alignItems: 'center',
                padding: '16px',
                border: '1px solid #e1e5e9',
                borderRadius: '8px',
                backgroundColor: 'white'
              }}>
                {/* Platform Info */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  minWidth: '150px',
                  marginRight: '20px'
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '4px',
                    backgroundColor: platform?.color || '#ccc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '12px',
                    fontSize: '16px'
                  }}>
                    {platform?.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: '500', fontSize: '14px' }}>
                      {platform?.name}
                    </div>
                    {channel.postType && (
                      <div style={{ fontSize: '12px', color: '#6c757d' }}>
                        {channel.postType}
                      </div>
                    )}
                  </div>
                </div>

                {/* Date/Time Controls */}
                <div style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <input
                    type="date"
                    style={{
                      padding: '8px',
                      border: '1px solid #dee2e6',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                  
                  <input
                    type="time"
                    style={{
                      padding: '8px',
                      border: '1px solid #dee2e6',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />

                  <select
                    style={{
                      padding: '8px',
                      border: '1px solid #dee2e6',
                      borderRadius: '4px',
                      fontSize: '14px',
                      minWidth: '120px'
                    }}
                  >
                    {isConnected ? (
                      <>
                        <option value="auto">Auto-post</option>
                        <option value="reminder">Reminder</option>
                      </>
                    ) : (
                      <option value="reminder">Reminder only</option>
                    )}
                  </select>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}>
      {/* Secondary Header Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 20px',
        borderBottom: '1px solid #e1e5e9',
        backgroundColor: '#f8f9fa'
      }}>
        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '24px'
        }}>
          {[
            { key: 'media', label: 'Media' },
            { key: 'caption', label: 'Caption' },
            { key: 'date', label: 'Date' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                background: 'none',
                border: 'none',
                padding: '8px 0',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                color: activeTab === tab.key ? '#007bff' : '#6c757d',
                borderBottom: activeTab === tab.key ? '2px solid #007bff' : '2px solid transparent',
                transition: 'all 0.2s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '12px'
        }}>
          <button
            onClick={onCancel}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Cancel
          </button>
          
          <button
            onClick={onUpdate}
            style={{
              padding: '8px 16px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Update
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'media' && renderMediaView()}
      {activeTab === 'caption' && renderCaptionView()}
      {activeTab === 'date' && renderDateView()}
    </div>
  )
}

export default CrossChannelEditor