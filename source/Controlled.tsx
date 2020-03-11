import 'focus-options-polyfill'
import React, {
  CSSProperties,
  FC,
  ReactNode,
  StrictMode,
  memo,
  useCallback,
  useRef,
  useState
} from 'react'
import ControlledActivated from './ControlledActivated'
import './styles.css'

interface Props {
  children: ReactNode
  closeText?: string
  isZoomed: boolean
  onZoomChange?: (value: boolean) => void
  openText?: string
  overlayBgColorEnd?: string
  overlayBgColorStart?: string
  portalEl?: HTMLElement
  scrollableEl?: HTMLElement | Window
  transitionDuration?: number
  wrapStyle?: CSSProperties | undefined
  zoomMargin?: number
  zoomZindex?: number
}

const Controlled: FC<Props> = ({
  children,
  closeText = 'Unzoom image',
  isZoomed: isActive,
  overlayBgColorEnd = 'rgba(255, 255, 255, 0.95)',
  overlayBgColorStart = 'rgba(255, 255, 255, 0)',
  portalEl,
  onZoomChange,
  openText = 'Zoom image',
  scrollableEl,
  transitionDuration = 300,
  wrapStyle,
  zoomMargin = 0,
  zoomZindex = 2147483647
}: Props) => {
  const [isChildLoaded, setIsChildLoaded] = useState<boolean>(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)

  const handleClickTrigger = useCallback(
    e => {
      if (!isActive && onZoomChange) {
        e.preventDefault()
        onZoomChange(true)
      }
    },
    [isActive, onZoomChange]
  )

  const handleChildLoad = useCallback(() => {
    setIsChildLoaded(true)
  }, [])

  const handleChildUnload = useCallback(() => {
    setIsChildLoaded(false)

    if (btnRef.current) {
      btnRef.current.focus({ preventScroll: true })
    }
  }, [])

  const wrapType = isChildLoaded ? 'hidden' : 'visible'

  return (
    <StrictMode>
      <div data-rmiz-wrap={wrapType} ref={wrapRef} style={wrapStyle}>
        {children}
        <button
          aria-label={openText}
          data-rmiz-btn-open
          onClick={handleClickTrigger}
          ref={btnRef}
          type="button"
        />
        {typeof window !== 'undefined' && (
          <ControlledActivated
            closeText={closeText}
            isActive={isActive}
            onLoad={handleChildLoad}
            onUnload={handleChildUnload}
            onZoomChange={onZoomChange}
            overlayBgColorEnd={overlayBgColorEnd}
            overlayBgColorStart={overlayBgColorStart}
            parentRef={wrapRef}
            portalEl={portalEl}
            scrollableEl={scrollableEl}
            transitionDuration={transitionDuration}
            zoomMargin={zoomMargin}
            zoomZindex={zoomZindex}
          >
            {children}
          </ControlledActivated>
        )}
      </div>
    </StrictMode>
  )
}

export default memo(Controlled)
