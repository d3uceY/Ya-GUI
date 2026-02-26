export namespace utils {
	
	export class SavedDir {
	    name: string;
	    path: string;
	
	    static createFrom(source: any = {}) {
	        return new SavedDir(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.path = source["path"];
	    }
	}
	export class AppConfig {
	    defaultDir?: string;
	    preferredTerminal?: string;
	    startOnBoot?: boolean;
	    savedDirectories?: SavedDir[];
	
	    static createFrom(source: any = {}) {
	        return new AppConfig(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.defaultDir = source["defaultDir"];
	        this.preferredTerminal = source["preferredTerminal"];
	        this.startOnBoot = source["startOnBoot"];
	        this.savedDirectories = this.convertValues(source["savedDirectories"], SavedDir);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class RunHistoryEntry {
	    shortcutName: string;
	    command: string;
	    directory: string;
	    timestamp: string;
	
	    static createFrom(source: any = {}) {
	        return new RunHistoryEntry(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.shortcutName = source["shortcutName"];
	        this.command = source["command"];
	        this.directory = source["directory"];
	        this.timestamp = source["timestamp"];
	    }
	}

}

