/**
 * Mitt: Tiny functional event emitter / pubsub
 *
 * @name mitt
 * @param {Map} [all] Optional Map of event names to registered handler functions
 * @returns {Function} The function's instance
 */
export default function mitt (all = new Map()) {
  return {
    /**
     * A Map of event names to registered handler functions.
     */
    all,

    /**
     * Register an event handler for the given type.
     *
     * @param {string|symbol} type Type of event to listen for, or `"*"` for all events
     * @param {Function} handler Function to call in response to given event
     */
    on (type, handler) {
      const handlers = all.get(type)
      const added = handlers && handlers.push(handler)
      if (!added) {
        all.set(type, [handler])
      }
    },

    /**
     * Remove an event handler for the given type.
     *
     * @param {string|symbol} type Type of event to unregister `handler` from, or `"*"`
     * @param {Function} handler Handler function to remove
     */
    off (type, handler) {
      const handlers = all.get(type)
      if (handlers) {
        handlers.splice(handlers.indexOf(handler) >>> 0, 1)
      }
    },

    /**
     * Invoke all handlers for the given type.
     * If present, `"*"` handlers are invoked after type-matched handlers.
     *
     * Note: Manually firing "*" handlers is not supported.
     *
     * @param {string|symbol} type The event type to invoke
     * @param {*} [evt] Any value (object is recommended and powerful), passed to each handler
     */
    emit (type, evt) {
      for (const handler of (all.get(type) || []).slice()) handler(evt)
      for (const handler of (all.get('*') || []).slice()) handler(type, evt)
    },

    /**
     * Remove all event handlers.
     *
     * Note: This will also remove event handlers passed via `mitt(all: EventHandlerMap)`.
     */
    clear () {
      all.clear()
    }
  }
}
