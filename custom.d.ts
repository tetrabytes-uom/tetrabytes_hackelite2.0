// custom.d.ts

// the namespace conflicts, so import as 'mg'
import { default as mg } from 'mongoose';

declare global {
  var mongoose: {
    conn: null | typeof mg;
    promise: null | Promise<typeof mg>;
  };
}
