const QUEUE_LIMIT_RATIO = 4

class Queue {
    constructor(rateLimit, ratePeriod = 1000) {
        this.rateLimit = rateLimit
        this.ratePeriod = ratePeriod

        this.recent = []
        this.queue = []
        this.queueTimeout
    }

    add() {
        return new Promise((resolve, reject) => {
            if (this.queue.length >= (this.rateLimit * QUEUE_LIMIT_RATIO)) {
                reject({ response: { status: 500, statusText: 'Too many requests queued' } })
                return
            }

            this.queue.push({ resolve, reject })
            this.triggerProcessor()
        })
    }

    triggerProcessor() {
        if (!this.queueTimeout && this.queue.length) {
            const delay = this.getDelay()
            this.queueTimeout = setTimeout(() => this.processQueue(), delay)
        }
    }

    getDelay() {
        const cutoff = new Date() - this.ratePeriod
        this.recent = this.recent.filter(t => (t > cutoff))
        
        if (this.recent.length >= this.rateLimit) {
            const rateItem = this.recent[this.recent.length - this.rateLimit]
            return rateItem - cutoff
        }
        return 0
    }

    processQueue() {
        this.queueTimeout = null
        const items = this.queue.splice(0, 1)

        const runTime = new Date()
        this.recent = this.recent.concat(items.map(i => runTime))

        items.forEach(i => i.resolve())

        this.triggerProcessor()
    }
}

module.exports = Queue
