/**
 * FACTORY METHOD (Virtual Constructor)
 *
 *
 * ----------------
 * Usage:
 * when a class can't anticipate the type of objects to create
 * to have a subclass specify the objects it creates
 * to localize the knowledge of which helper subclass is the delegate
 *
 *
 * ---------------
 * Consequences:
 * + Eliminates need to bind specific classes in code
 * + Provides hook for subclasses
 * + Can connect parallel class hierarchies
 * - Requires subclassing if not using the template method
 *
 */

// PRODUCT
// Defines the interface of objects
// that the factory method creates.
interface Doc {
	ext: string
	name: string
	open(): string
}

// CONCRETE PRODUCTS
// Implements the Product interface.
class WordDoc implements Doc {
	public ext: string = `.docx`
	public name: string = `Document1${this.ext}`
	open = () => `start ${this.name}`
}

class PagesDoc implements Doc {
	public ext: string = `.pages`
	public name: string = `Untitled1${this.ext}`
	open = () => `open -a 'Pages' ${this.name}`
}


// CREATOR
// Declares factory method that returns
// an object of type Product.
abstract class TextEditor {
	// The factory method that does not know
	// what specific type of 'Doc' is yet
	protected abstract createDoc(): Doc

	private docs: { [name: string]: Doc } = {}

	public newDoc() {
		const doc = this.createDoc()
		this.docs[doc.name] = doc
		return this.openDoc(doc.name)
	}

	public openDoc(docName: string) {
		const doc = this.docs[docName]
		return doc.open()
	}
}


// CONCRETE CREATORS
// Overrides the factory method to
// return an instance of a Concrete Product.
class Word extends TextEditor {
	protected createDoc() {
		return new WordDoc()
	}
}

class Pages extends TextEditor {
	protected createDoc() {
		return new PagesDoc()
	}
}

export { Word, Pages }