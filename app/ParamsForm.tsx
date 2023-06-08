import Button from "./Button";

export default function ParamsForm({ onSubmit, loading }: { onSubmit: (event: React.FormEvent<HTMLFormElement>) => void, loading: boolean}) {
  return (
    <form className='form' onSubmit={onSubmit}>
      <div className='input_wrapper'>
        <label htmlFor="urls">
          URLs
          <br />
          (One per line)
        </label>
        <textarea name="urls" id="urls" cols={15} rows={5} required></textarea>
      </div>

      <div className="input_wrapper">
        <label htmlFor="runCount">Run Count</label>
        <input type="number" name="runCount" id="runCount" defaultValue={1} min={1} max={10} required />
      </div>

      <div className="input_wrapper">
        <label htmlFor="categories">Categories</label>
        <select name="categories" id="categories" multiple required>
          <option value="performance">Performance</option>
          <option value="accessibility">Accessibility</option>
          <option value="best-practices">Best Practices</option>
          <option value="seo">SEO</option>
          <option value="pwa">PWA</option>
        </select>
      </div>

      <div className="input_wrapper">
        <label htmlFor="device">Device</label>
        <select name="device" id="device" required>
          <option value="mobile">Mobile</option>
          <option value="desktop">Desktop</option>
          <option value="both">Mobile and Desktop</option>
        </select>
      </div>

      <Button type="submit" disabled={loading}>Run report</Button>
    </form>
  )
}