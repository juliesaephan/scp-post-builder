import { useState, useEffect } from 'react'
import { getPlatformById } from '../data/platforms'
import PostPreview from './PostPreview'

const PreviewCarousel = ({ selectedChannels, caption, media }) => {
  const [activePreviewIndex, setActivePreviewIndex] = useState(0)
  const [previewData, setPreviewData] = useState([])

  // Generate preview data when channels or content changes
  useEffect(() => {
    const data = selectedChannels.map(channel => {
      const platform = getPlatformById(channel.id)
      return {
        id: channel.id,
        platform: platform,
        postType: channel.postType,
        content: {
          caption: caption || '',
          media: media || [],
          account: platform?.account || "Bestie's Bakes"
        }
      }
    })
    setPreviewData(data)
    
    // Reset active index if it's out of bounds
    if (activePreviewIndex >= data.length && data.length > 0) {
      setActivePreviewIndex(0)
    }
  }, [selectedChannels, caption, media, activePreviewIndex])

  const handleTabClick = (index) => {
    setActivePreviewIndex(index)
  }

  const handlePrevious = () => {
    setActivePreviewIndex(prev => 
      prev > 0 ? prev - 1 : previewData.length - 1
    )
  }

  const handleNext = () => {
    setActivePreviewIndex(prev => 
      prev < previewData.length - 1 ? prev + 1 : 0
    )
  }

  if (selectedChannels.length === 0) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: '#6c757d',
        fontSize: '14px',
        textAlign: 'center'
      }}>
        Select channels and add content to see preview
      </div>
    )
  }

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Channel Tab Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '16px',
        borderBottom: '1px solid #e1e5e9',
        gap: '8px',
        overflowX: 'auto'
      }}>
        {/* Previous Arrow */}
        {previewData.length > 1 && (
          <button
            onClick={handlePrevious}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
              fontSize: '16px',
              color: '#6c757d'
            }}
          >
            ‹
          </button>
        )}

        {/* Channel Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          flex: 1,
          justifyContent: 'center'
        }}>
          {previewData.map((preview, index) => (
            <button
              key={preview.id}
              onClick={() => handleTabClick(index)}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: preview.platform.color,
                color: 'white',
                border: activePreviewIndex === index ? '2px solid #007bff' : '2px solid transparent',
                cursor: 'pointer',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: activePreviewIndex === index ? 1 : 0.7,
                transition: 'all 0.2s ease'
              }}
            >
              {preview.platform.icon}
            </button>
          ))}
        </div>

        {/* Next Arrow */}
        {previewData.length > 1 && (
          <button
            onClick={handleNext}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
              fontSize: '16px',
              color: '#6c757d'
            }}
          >
            ›
          </button>
        )}
      </div>

      {/* Preview Carousel */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <div
          style={{
            display: 'flex',
            width: `${previewData.length * 100}%`,
            height: '100%',
            transform: `translateX(-${(activePreviewIndex * 100) / previewData.length}%)`,
            transition: 'transform 0.3s ease'
          }}
        >
          {previewData.map((preview, index) => (
            <div
              key={preview.id}
              style={{
                width: `${100 / previewData.length}%`,
                height: '100%',
                opacity: index === activePreviewIndex ? 1 : 0.3,
                transition: 'opacity 0.3s ease',
                padding: '16px',
                boxSizing: 'border-box'
              }}
            >
              <PostPreview
                platform={preview.platform}
                postType={preview.postType}
                content={preview.content}
                isActive={index === activePreviewIndex}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PreviewCarousel