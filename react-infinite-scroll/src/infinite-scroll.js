
import React, { useCallback, useEffect, useState } from 'react'

// Creates an IntersectionObserver to know when component
// is on the screen. Will always call `loadFn` automatically
// `moreTest` return truthy while it is on screen.
export const InfiniteScroll = ({
  loadFn,
  moreTest,
  observerOpts = { threshold: 0.2 },
  children
}) => {
  // Create ref for observed target. Using callback allows
  // us to know if it gets removed from the DOM. Saving
  // it as state allows using it as a dependency to
  // useEffect later, so changing it triggers appropriate
  // cleanup of the observer.
  const [target, setTarget] = useState()
  const ref = useCallback(
    node => {
      if (!Object.is(node, target))
        setTarget(node) && console.log('setting target')
    },
    [target, setTarget]
  )

  useEffect(() => {
    // Bail early if missing deps or nothing to load.
    if (!target || !moreTest || !loadFn || !moreTest()) return

    // Stash target in closure for cleanup cycle
    const currentTarget = target

    // Callback when intersection occurs. Needs to be
    // inside useEffect because setTarget gets out of sync
    // with observer lifecycle.
    const onIntersect = entries => {

      // Search intersections for the target.
      const t = entries.find(
        e => e.isIntersecting && Object.is(e.target, target))

      // If we have intersection, and more to load, then 
      // load it. Recheck moreTest, since things might 
      // change out from under us while waiting for intersect.
      t && moreTest() && loadFn()
    }

    // Create the observer; also stuck inside effect because
    // onIntersect is stuck inside.
    const observer = new IntersectionObserver(onIntersect, observerOpts)

    // Start watching.
    observer.observe(currentTarget)

    // Return a disposal function that React can call
    // when dependencies change.
    return () => currentTarget && observer.unobserve(currentTarget)

  }, [target, moreTest, loadFn, observerOpts])

  // Need to a real (and knowable) DOM element to track,
  // so Fragment won't work here.
  return <div ref={ref}>{children}</div>
}

export default InfiniteScroll

