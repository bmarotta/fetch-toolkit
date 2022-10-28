import { FetchHandler, RequestInitToolkit } from './fetch-toolkit';
import crypto from "crypto";

type FetchRequest = {
  id: string;
  url: string;
  init?: RequestInitToolkit;
  promise?: Promise<Response>;
  started?: (promise: Promise<Response>) => void;
};

export class FetchGroupHandlerError extends Error {}

export class FetchGroupHandler extends FetchHandler {
  private queue: FetchRequest[] = [];
  private executing: FetchRequest[] = [];
  constructor(public readonly baseUrl: string, public readonly maxParallel: number = 0, public debug: boolean = false) {
    super();
  }
  public fetch(url: string, init?: RequestInitToolkit | undefined): Promise<Response> {
    // Initialize unique id
    init = init ?? {};
    if (!init.uid) {
      init.uid = crypto.randomUUID();
    }
    const fetchId = init.uid;

    // Check if fetch with unique id already exists
    if (this.queue.find(n => n.id == fetchId)) {
      throw new FetchGroupHandlerError(`Fetch with uid ${fetchId} already in the queue`);
    }
    if (this.executing.find(n => n.id == fetchId)) {
      throw new FetchGroupHandlerError(`Fetch with uid ${fetchId} already executing`);
    }

    // Setup request
    const fetchRequest: FetchRequest = {
      id: fetchId,
      url: url,
      init: init
    };
    if (!this.maxParallel || this.executing.length < this.maxParallel) {
      // We can start right away
      return this.startFetch(fetchRequest);
    } else {
      // We have to enqueue
      return this.enqueue(fetchRequest);
    }
  }

  startFetch(fetchRequest: FetchRequest): Promise<Response> {
    if (this.debug) {
        console.log(`Starting request ${fetchRequest.id} to url ${fetchRequest.url}. ${this.executing.length} requests on going. ${this.enqueue.length} in the queue`);
    }
    // Do the actual fetch
    fetchRequest.promise = fetch(fetchRequest.url, fetchRequest.init);

    // Add to the executing list
    this.executing.push(fetchRequest);

    if (fetchRequest.started) {
      // Trigger the started handler
      fetchRequest.started(fetchRequest.promise);
    }

    // Add resolve and reject handlers to remove from the lists
    fetchRequest.promise
      .then(() => this.removeFromExecuting(fetchRequest.id))
      .catch(() => this.removeFromExecuting(fetchRequest.id));

    return fetchRequest.promise;
  }
  removeFromExecuting(id: string): any {
    if (this.debug) {
        console.log(`Finished request ${id}`);
    }
    const index = this.executing.findIndex(n => n.id == id);
    if (index == -1) {
      console.error(`Unexpected error. Fetch ${id} not found in executing list`);
    } else {
      this.executing.splice(index, 1);
    }
    if (this.maxParallel && this.executing.length < this.maxParallel && this.queue.length) {
      // start the next one
      const next = this.queue[0];
      this.queue.splice(0, 1);
      this.startFetch(next);
    }
  }

  enqueue(fetchRequest: FetchRequest): Promise<Response> {
    if (this.debug) {
        console.log(`Enqueueing request ${fetchRequest.id} to url ${fetchRequest.url}`);
    }
    // Add to the list of
    this.queue.push(fetchRequest);

    return new Promise((resolve, reject) => {
      fetchRequest.started = (promise: Promise<Response>) => {
        promise.then(value => resolve(value)).catch(reason => reject(reason));
      };
    });
  }
}
